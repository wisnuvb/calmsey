#!/usr/bin/env bash
# Cek apakah Next.js merespons; restart PM2 jika tidak.
# Pasang di cron, mis. tiap 2 menit:
#   */2 * * * * /var/www/html/projects/turningtidesfacility/scripts/healthcheck.sh >> /var/www/html/projects/turningtidesfacility/logs/healthcheck.log 2>&1
set -euo pipefail

APP_NAME="turningtidesfacility"
PORT="${PORT:-2039}"
URL="http://127.0.0.1:${PORT}/api/public/languages"
MAX_TIME=10

if curl -sf --max-time "$MAX_TIME" -H "Accept: application/json" "$URL" >/dev/null; then
  exit 0
fi

echo "$(date -Iseconds) [healthcheck] FAIL $URL — restarting $APP_NAME"
pm2 restart "$APP_NAME" --update-env || pm2 start ecosystem.config.js --only "$APP_NAME"
