# PostgreSQL migrations

Production deployments use **PostgreSQL with explicit migrations** (`push: false` in production).

SQLite local dev does not use this folder.

## Create the initial migration (once)

Requires **Docker** (Postgres) and **Node 22** (`migrate:create` fails on Node 24 with tsx).

```bash
pnpm docker:up
export DATABASE_DRIVER=postgres
export DATABASE_URL=postgresql://crispy:crispy@127.0.0.1:5432/crispy
export PAYLOAD_SECRET=your-dev-secret

pnpm migrate:create:initial
git add src/migrations
git commit -m "chore: add initial postgres migration"
```

Or run the helper script:

```bash
pnpm migrate:create:initial
```

## Apply migrations

```bash
export DATABASE_DRIVER=postgres
export DATABASE_URL=postgresql://...
pnpm migrate
pnpm migrate:status
```

## After schema changes

```bash
pnpm migrate:create my_change_name
pnpm migrate
```

Commit new files under `src/migrations/`.
