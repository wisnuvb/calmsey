#!/usr/bin/env bash
# Deploy production: build di mesin lokal → upload .next → restart PM2 di server.
#
# Prasyarat:
#   1. Kode sudah di-push ke origin/main (server akan git pull)
#   2. .env / .env.production lokal berisi NEXT_PUBLIC_* nilai prod (dibake saat build)
#   3. SSH key ke ubuntu@139.99.125.212 sudah terpasang
#
# Usage:
#   yarn deploy:prod
#   SKIP_LINT=1 yarn deploy:prod
#   DEPLOY_SERVER=ubuntu@host DEPLOY_PATH=/path/to/app yarn deploy:prod
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

DEPLOY_SERVER="${DEPLOY_SERVER:-ubuntu@139.99.125.212}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/html/projects/turningtidesfacility}"
PM2_APP="${PM2_APP:-turningtidesfacility}"

ssh_cmd() {
  ssh -o BatchMode=yes "$DEPLOY_SERVER" "export PATH=\"\$HOME/.nvm/versions/node/v22.21.1/bin:\$PATH\"; source \"\$HOME/.nvm/nvm.sh\" 2>/dev/null; $*"
}

echo "==> Target: $DEPLOY_SERVER:$DEPLOY_PATH (PM2: $PM2_APP)"

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  LOCAL_SHA="$(git rev-parse --short HEAD)"
  if git rev-parse origin/main >/dev/null 2>&1; then
    REMOTE_SHA="$(git rev-parse --short origin/main)"
    if [[ "$LOCAL_SHA" != "$REMOTE_SHA" ]]; then
      echo "PERINGATAN: HEAD lokal ($LOCAL_SHA) belum sama dengan origin/main ($REMOTE_SHA)."
      echo "  Push dulu: git push origin main  (atau yarn push:main -- \"message\")"
      echo "  Server akan git pull — tanpa push, .next bisa tidak match dengan kode server."
    else
      echo "==> Git OK: lokal = origin/main ($LOCAL_SHA)"
    fi
  fi
fi

if [[ "${SKIP_LINT:-}" != "1" ]]; then
  echo "==> ESLint (lokal)"
  yarn lint
fi

if [[ "${SKIP_TYPECHECK:-}" != "1" ]]; then
  echo "==> TypeScript (lokal)"
  yarn type-check
fi

echo "==> Next.js build (lokal)"
yarn build:next

if [[ ! -f .next/BUILD_ID ]]; then
  echo "ERROR: .next/BUILD_ID tidak ada — build lokal gagal."
  exit 1
fi

echo "==> Git pull + install di server"
ssh_cmd "cd '$DEPLOY_PATH' && git pull && npm install --legacy-peer-deps && npx prisma generate"

echo "==> Stop PM2 $PM2_APP di server"
ssh_cmd "pm2 stop '$PM2_APP' 2>/dev/null || true"

echo "==> Upload .next ke server"
rsync -az --delete --progress \
  .next/ "$DEPLOY_SERVER:$DEPLOY_PATH/.next/"

echo "==> Restart PM2 $PM2_APP"
ssh_cmd "cd '$DEPLOY_PATH' && pm2 restart '$PM2_APP' --update-env || pm2 start ecosystem.config.js --only '$PM2_APP'"

echo "==> Deploy selesai"
echo "    Server: $DEPLOY_SERVER:$DEPLOY_PATH"
echo "    Cek:    ssh $DEPLOY_SERVER 'pm2 logs $PM2_APP --lines 30'"
