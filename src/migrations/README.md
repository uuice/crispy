# PostgreSQL migrations

Production deployments use **PostgreSQL with explicit migrations** (`push: false` in production).

SQLite local dev does not use this folder.

## Create the initial migration (once)

Requires **Docker** (Postgres). `migrate:create` works on Node 20/22/24 because this repo pins `tsx@4.21.0` via `pnpm.overrides` (avoids Node 24 + tsx≥4.21.1 `node:crypto` ENOENT; see Payload [#16949](https://github.com/payloadcms/payload/issues/16949)).

```bash
pnpm cli db:docker-up
export DATABASE_DRIVER=postgres
export DATABASE_URL=postgresql://crispy:crispy@127.0.0.1:5432/crispy
export PAYLOAD_SECRET=your-dev-secret

pnpm cli db:bootstrap
git add src/migrations
git commit -m "chore: add initial postgres migration"
```

## Apply migrations

```bash
export DATABASE_DRIVER=postgres
export DATABASE_URL=postgresql://...
pnpm cli db:migrate
pnpm cli db:status
```

## After schema changes

Requires **PostgreSQL** (`DATABASE_DRIVER=postgres` + `DATABASE_URL`). SQLite local dev uses schema push instead (see `.env` `DATABASE_PUSH`).

**Do not run `pnpm cli db:create` with SQLite** — it reads the Postgres snapshot in `src/migrations/*.json` and will fail with Zod validation errors.

```bash
pnpm cli db:docker-up
pnpm cli db:create my_change_name
pnpm cli db:migrate
```

The `db:create` command auto-sets Postgres env and starts Docker if needed.

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
pnpm cli db:migrate
pnpm cli db:status
```
