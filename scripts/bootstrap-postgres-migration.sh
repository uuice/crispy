#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export DATABASE_DRIVER=postgres
export DATABASE_URL="${DATABASE_URL:-postgresql://crispy:crispy@127.0.0.1:5432/crispy}"
export PAYLOAD_SECRET="${PAYLOAD_SECRET:-dev-migration-secret}"

# migrate:create requires Node 22 (Node 24 + tsx may fail); CI uses node 22
if command -v fnm >/dev/null 2>&1; then
  eval "$(fnm env)"
  fnm use 22 2>/dev/null || fnm install 22 && fnm use 22
fi

echo "→ Starting PostgreSQL (docker compose)…"
docker compose up -d --wait

echo "→ Creating migration (initial if none exist)…"
if compgen -G "src/migrations/*.ts" > /dev/null; then
  echo "   Migrations already exist; run: pnpm cli db:create <name>"
else
  node "$ROOT/scripts/cli.mjs" util:payload migrate:create initial
fi

echo "→ Applying migrations…"
node "$ROOT/scripts/cli.mjs" db:migrate

echo "→ Status:"
node "$ROOT/scripts/cli.mjs" db:status

echo "Done. Commit src/migrations/ if new files were created."
