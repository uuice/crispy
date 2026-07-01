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

Requires **PostgreSQL** (`DATABASE_DRIVER=postgres` + `DATABASE_URL`). SQLite local dev uses schema push instead (see `.env` `DATABASE_PUSH`).

**Do not run `pnpm migrate:create` with SQLite** — it reads the Postgres snapshot in `src/migrations/*.json` and will fail with Zod validation errors.

```bash
pnpm docker:up
pnpm migrate:create my_change_name
pnpm migrate
```

The `migrate:create` script auto-sets Postgres env, starts Docker if needed, and prefers Node 22.

Commit new files under `src/migrations/`.

## Reset remote database (empty schema + re-migrate)

When the remote DB was created via dev push or needs a clean slate:

```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO public;
```

Then:

```bash
pnpm migrate
pnpm migrate:status
```
