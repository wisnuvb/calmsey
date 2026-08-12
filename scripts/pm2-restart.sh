#!/usr/bin/env bash
# Restart turningtidesfacility — deteksi env PM2 tercemar (DATABASE_URL salah).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
exec "$ROOT/scripts/pm2-ensure.sh"
