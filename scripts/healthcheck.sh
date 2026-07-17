#!/usr/bin/env bash
# Wrapper cron: muat Node/PM2 path lalu jalankan healthcheck + email alert.
#
# Cron (tiap 2 menit):
#   */2 * * * * /var/www/html/projects/turningtidesfacility/scripts/healthcheck.sh >> /var/www/html/projects/turningtidesfacility/logs/healthcheck.log 2>&1
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# NVM / PM2 path (sesuaikan versi Node di server jika perlu)
export PATH="$HOME/.nvm/versions/node/v22.21.1/bin:$PATH"
if [[ -s "$HOME/.nvm/nvm.sh" ]]; then
  # shellcheck source=/dev/null
  source "$HOME/.nvm/nvm.sh"
fi

exec node "$ROOT/scripts/server-healthcheck.mjs"
