#!/usr/bin/env bash
# Pack a Linux spare-site bundle: standalone app for SQLite (no .env / secrets).
#
# Default: app only — does NOT ship .data/payload.db (safe for upgrades).
# First install / intentional DB replace: pass --with-db after pg-to-sqlite.
#
# Prerequisites:
#   - .next/standalone          (from build; or use CLI pack-sqlite-spare which builds)
#   - .data/payload.db          (only when --with-db)
#
# Usage:
#   pnpm cli dev:pack-sqlite-spare                 # build + pack (app only)
#   pnpm cli dev:pack-sqlite-spare -- --with-db    # build + pack with seed DB
#   pnpm cli dev:pack-sqlite-spare-standalone      # pack only (already built)
#   pnpm cli dev:pack-sqlite-spare-standalone -- --with-db
#
# Same LINUX_ARCH / LINUX_LIBC as pack-linux.
#
# On server (upgrade — preserve live DB):
#   tar -xzf crispy-*-linux-*-sqlite-spare-*.tar.gz -C /opt/crispy
#   # or: ./upgrade.sh /path/to/archive.tar.gz  (excludes .env + payload.db)
#   cd /opt/crispy && ./pm2.sh reload
#
# On server (first install with seed archive):
#   tar -xzf crispy-*-linux-*-sqlite-spare-seed-*.tar.gz -C /opt/crispy
#   cd /opt/crispy && cp .env.example .env && ./start.sh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

WITH_DB=0
PASS_ARGS=()
for arg in "$@"; do
  case "$arg" in
    --with-db)
      WITH_DB=1
      ;;
    *)
      PASS_ARGS+=("$arg")
      ;;
  esac
done

DB_FILE=".data/payload.db"

export PACK_LINUX=1
export PACK_SQLITE_SPARE=1
export PACK_SQLITE_WITH_DB=0
export LINUX_ARCH="${LINUX_ARCH:-x64}"
export LINUX_LIBC="${LINUX_LIBC:-glibc}"

if [[ "$WITH_DB" == "1" ]]; then
  if [[ ! -f "$DB_FILE" ]]; then
    echo "error: missing $DB_FILE — run: pnpm cli db:pg-to-sqlite" >&2
    exit 1
  fi
  export PACK_SQLITE_WITH_DB=1
  echo "→ SQLite spare SEED pack (linux/${LINUX_ARCH}, ${LINUX_LIBC})"
  echo "→ DB: $DB_FILE ($(du -h "$DB_FILE" | cut -f1)) — will overwrite server DB if extracted blindly"
else
  echo "→ SQLite spare APP pack (linux/${LINUX_ARCH}, ${LINUX_LIBC})"
  echo "→ DB: not included (upgrade-safe). First install: add --with-db or copy payload.db onto the server."
fi

echo "→ Note: .env / runtime secrets are NOT bundled — configure on the server"

PACK_LINUX_SCRIPT="$(dirname "$0")/pack-linux-standalone.sh"
if ((${#PASS_ARGS[@]})); then
  exec "$PACK_LINUX_SCRIPT" "${PASS_ARGS[@]}"
fi
exec "$PACK_LINUX_SCRIPT"
