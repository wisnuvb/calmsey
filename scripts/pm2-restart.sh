#!/usr/bin/env bash
# Restart hanya app turningtidesfacility — jangan sentuh proses PM2 lain.
set -euo pipefail

if ! pm2 describe turningtidesfacility >/dev/null 2>&1; then
  echo "App 'turningtidesfacility' belum terdaftar di PM2. Jalankan sekali:"
  echo "  pm2 start ecosystem.config.js --only turningtidesfacility"
  echo "  pm2 save"
  exit 1
fi

pm2 restart turningtidesfacility --update-env
echo "PM2: turningtidesfacility restarted (proses lain tidak disentuh)."
