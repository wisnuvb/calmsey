#!/usr/bin/env bash
# Pasang cron healthcheck + email alert (idempotent).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CRON_CMD="$ROOT/scripts/healthcheck.sh >> $ROOT/logs/healthcheck.log 2>&1"
CRON_LINE="*/2 * * * * $CRON_CMD"

mkdir -p "$ROOT/logs"
chmod +x "$ROOT/scripts/healthcheck.sh"

if crontab -l 2>/dev/null | grep -Fq "scripts/healthcheck.sh"; then
  echo "Cron healthcheck sudah terpasang."
else
  (crontab -l 2>/dev/null; echo "$CRON_LINE") | crontab -
  echo "Cron healthcheck ditambahkan: setiap 2 menit"
fi

echo ""
echo "Configure email in Admin → Settings → Email (Gmail App Password)"
echo "  1. npm install --legacy-peer-deps"
echo "  2. Set Gmail + App Password + alert recipients in admin panel, then Save"
echo "  3. yarn healthcheck:test-email"
echo "  4. tail -f $ROOT/logs/healthcheck.log"
