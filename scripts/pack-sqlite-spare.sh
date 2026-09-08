#!/usr/bin/env bash
# Pack a Linux spare-site bundle: standalone app + SQLite DB (no .env / secrets).
#
# Prerequisites:
#   - .data/payload.db          (from pnpm cli db:pg-to-sqlite)
#   - .next/standalone          (from build; or use CLI pack-sqlite-spare which builds)
#
# Usage:
#   pnpm cli dev:pack-sqlite-spare              # build + pack
#   pnpm cli dev:pack-sqlite-spare-standalone   # pack only (already built)
#
# Same LINUX_ARCH / LINUX_LIBC as pack-linux.
#
# On server:
#   tar -xzf crispy-*-linux-*-sqlite-spare-*.tar.gz -C /opt/crispy
#   cd /opt/crispy
#   cp .env.example .env   # configure SQLite + secrets locally
#   ./start.sh
#   # or: ./pm2.sh start

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

DB_FILE=".data/payload.db"

if [[ ! -f "$DB_FILE" ]]; then
  echo "error: missing $DB_FILE — run: pnpm cli db:pg-to-sqlite" >&2
  exit 1
fi

export PACK_LINUX=1
export PACK_SQLITE_SPARE=1
export LINUX_ARCH="${LINUX_ARCH:-x64}"
export LINUX_LIBC="${LINUX_LIBC:-glibc}"

echo "→ SQLite spare pack (linux/${LINUX_ARCH}, ${LINUX_LIBC})"
echo "→ DB: $DB_FILE ($(du -h "$DB_FILE" | cut -f1))"
echo "→ Note: .env / runtime secrets are NOT bundled — configure on the server"

exec "$(dirname "$0")/pack-linux-standalone.sh" "$@"
