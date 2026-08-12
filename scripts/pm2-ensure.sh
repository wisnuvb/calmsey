#!/usr/bin/env bash
# Start/restart turningtidesfacility dengan env bersih.
# PM2 bisa menyimpan DATABASE_URL dari proyek lain di dump proses; nilai itu
# menimpa .env MySQL dan memicu PrismaClientInitializationError (500 di API).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

PM2_APP="${PM2_APP:-turningtidesfacility}"

pm2_app_id() {
  pm2 jlist 2>/dev/null | node -e "
    const apps = JSON.parse(require('fs').readFileSync(0, 'utf8'));
    const app = apps.find((p) => p.name === process.argv[1]);
    if (app) process.stdout.write(String(app.pm_id));
  " "$PM2_APP" 2>/dev/null || true
}

pm2_injected_database_url() {
  local id db_line
  id="$(pm2_app_id)"
  [ -n "$id" ] || return 1
  db_line="$(pm2 env "$id" 2>/dev/null | grep -E '^DATABASE_URL:' || true)"
  [ -n "$db_line" ] || return 1
  echo "${db_line#DATABASE_URL: }"
}

needs_clean_start() {
  if ! pm2 describe "$PM2_APP" >/dev/null 2>&1; then
    return 0
  fi

  local injected
  injected="$(pm2_injected_database_url || true)"
  if [ -n "$injected" ] && [[ "$injected" != mysql://* ]]; then
    echo "PERINGATAN: PM2 menyuntikkan DATABASE_URL non-MySQL (env dari proyek lain)."
    echo "  Gunakan pm2 delete + start agar Next.js membaca .env proyek ini."
    return 0
  fi

  return 1
}

start_clean() {
  pm2 delete "$PM2_APP" 2>/dev/null || true
  pm2 start ecosystem.config.js --only "$PM2_APP"
  pm2 save
  echo "PM2: $PM2_APP started dengan env bersih (DATABASE_URL dari .env)."
}

if needs_clean_start; then
  start_clean
elif pm2 describe "$PM2_APP" >/dev/null 2>&1; then
  pm2 restart "$PM2_APP" --update-env
  echo "PM2: $PM2_APP restarted (proses lain tidak disentuh)."
else
  start_clean
fi
