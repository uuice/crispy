#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export DATABASE_DRIVER=postgres
export DATABASE_URL="${DATABASE_URL:-postgresql://crispy:crispy@127.0.0.1:5432/crispy}"
export PAYLOAD_SECRET="${PAYLOAD_SECRET:-dev-migration-secret}"

# tsx is pinned to 4.21.0 (package.json pnpm.overrides) so migrate:create works on Node 20/22/24.
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
