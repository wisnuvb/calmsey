#!/usr/bin/env bash
# Build production di server yang sama dengan PM2 (next start).
# Kalau webpack compile kena SIGKILL, pakai: yarn deploy:prod (build lokal + upload .next).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

PM2_APP="${PM2_APP:-turningtidesfacility}"
PM2_REGISTERED=0

if command -v pm2 >/dev/null 2>&1 && pm2 describe "$PM2_APP" >/dev/null 2>&1; then
  PM2_REGISTERED=1
  echo "==> Stop PM2 $PM2_APP (sementara, bebaskan RAM untuk build)"
  pm2 stop "$PM2_APP" || true
fi

if [ "${CLEAN_BUILD:-}" = "1" ]; then
  echo "==> Clean .next penuh (CLEAN_BUILD=1)"
  rm -rf .next
elif [ "${CLEAN_CACHE:-}" = "1" ]; then
  echo "==> Bersihkan .next/cache (CLEAN_CACHE=1)"
  rm -rf .next/cache
else
  echo "==> Pakai .next existing (incremental, tanpa hapus cache)"
fi

echo "==> ESLint"
yarn lint

if [ "${SKIP_TYPECHECK:-}" != "1" ]; then
  echo "==> TypeScript"
  yarn type-check
fi

echo "==> Next.js build"
yarn build:next

if [ "$PM2_REGISTERED" = "1" ]; then
  echo "==> Restart PM2 $PM2_APP"
  pm2 restart "$PM2_APP" --update-env || pm2 start ecosystem.config.js --only "$PM2_APP"
fi

echo "==> Build selesai"
