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

# Node 24 + tsx may fail with ENOENT on node:crypto; prefer Node 22 when available.
if command -v fnm >/dev/null 2>&1; then
  eval "$(fnm env)"
  fnm use 22 2>/dev/null || fnm install 22 && fnm use 22
elif command -v nvm >/dev/null 2>&1; then
  # shellcheck disable=SC1090
  source "$NVM_DIR/nvm.sh" 2>/dev/null || source "$HOME/.nvm/nvm.sh"
  nvm use 22 2>/dev/null || true
fi

NODE_MAJOR="$(node -p "process.version.slice(1).split('.')[0]")"
if [[ "$NODE_MAJOR" -ge 24 ]]; then
  echo "Warning: Node $(node -v) may fail migrate:create. Use Node 22 if you see node:crypto errors." >&2
fi

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
