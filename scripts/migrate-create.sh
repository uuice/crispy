#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# migrate:create only works with PostgreSQL (SQLite uses a different snapshot format).
export DATABASE_DRIVER=postgres
export DATABASE_URL="${DATABASE_URL:-postgresql://crispy:crispy@127.0.0.1:5432/crispy}"
export PAYLOAD_SECRET="${PAYLOAD_SECRET:-dev-migration-secret}"

if [[ ! "$DATABASE_URL" =~ ^postgres(ql)?:// ]]; then
  echo "Error: migrate:create requires PostgreSQL." >&2
  echo "  Current DATABASE_URL: ${DATABASE_URL}" >&2
  echo "  Example:" >&2
  echo "    export DATABASE_DRIVER=postgres" >&2
  echo "    export DATABASE_URL=postgresql://crispy:crispy@127.0.0.1:5432/crispy" >&2
  echo "    pnpm cli db:create my_change_name" >&2
  exit 1
fi

# Node 24 + tsx≥4.21.1 can hit ENOENT on node:crypto (Payload #16949 / tsx #801).
# Crispy pins tsx@4.21.0 via pnpm.overrides so Node 20/22/24 all work for migrate:create.
if ! command -v docker >/dev/null 2>&1; then
  echo "Warning: Docker not found. Ensure PostgreSQL is reachable at DATABASE_URL." >&2
else
  if ! docker compose ps --status running postgres 2>/dev/null | grep -q postgres; then
    echo "→ Starting PostgreSQL (docker compose)…"
    docker compose up -d --wait
  fi
fi

echo "→ Creating migration (postgres, Node $(node -v))…"
exec cross-env NODE_OPTIONS=--no-deprecation payload migrate:create "$@"
