#!/usr/bin/env bash
# Pack Next.js standalone output for self-hosted deployment.
# Requires `pnpm cli dev:build` first (or use `pnpm cli dev:pack` which builds automatically).
#
# Linux deploy: use scripts/pack-linux-standalone.sh (sets PACK_LINUX=1 and platform env).
#   PACK_LINUX=1     — exclude public/media, patch native modules, prune bundle
#   LINUX_ARCH=x64   — target CPU (x64 | arm64)
#   LINUX_LIBC=glibc — target libc (glibc | musl for Alpine)

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

STANDALONE_DIR=".next/standalone"
STATIC_DIR=".next/static"
PUBLIC_DIR="public"
OUT_DIR="dist"

if [[ ! -f "$STANDALONE_DIR/server.js" ]]; then
  echo "error: $STANDALONE_DIR/server.js not found. Run 'pnpm cli dev:build' first." >&2
  exit 1
fi

# Drop prior archives so they are not nested into the new tarball
# (Next standalone may already have copied dist/ during a previous build).
echo "→ Removing dist/ before pack..."
rm -rf "$OUT_DIR" "$STANDALONE_DIR/dist"

VERSION="$(node -p "require('./package.json').version")"
TIMESTAMP="$(date -u +%Y%m%d%H%M%S)"
LINUX_ARCH="${LINUX_ARCH:-x64}"
LINUX_LIBC="${LINUX_LIBC:-glibc}"
STAGING_DIR="$OUT_DIR/crispy-standalone-$VERSION"
if [[ "${PACK_SQLITE_SPARE:-}" == "1" ]]; then
  if [[ "${PACK_SQLITE_WITH_DB:-}" == "1" ]]; then
    ARCHIVE_NAME="crispy-${VERSION}-linux-${LINUX_ARCH}-sqlite-spare-seed-${TIMESTAMP}.tar.gz"
  else
    ARCHIVE_NAME="crispy-${VERSION}-linux-${LINUX_ARCH}-sqlite-spare-${TIMESTAMP}.tar.gz"
  fi
elif [[ "${PACK_LINUX:-}" == "1" ]]; then
  ARCHIVE_NAME="crispy-${VERSION}-linux-${LINUX_ARCH}-standalone-${TIMESTAMP}.tar.gz"
else
  ARCHIVE_NAME="crispy-${VERSION}-standalone-${TIMESTAMP}.tar.gz"
fi
ARCHIVE_PATH="$OUT_DIR/$ARCHIVE_NAME"

rm -rf "$STAGING_DIR"
mkdir -p "$STAGING_DIR" "$OUT_DIR"

echo "→ Copying standalone server..."
cp -a "$STANDALONE_DIR/." "$STAGING_DIR/"

if [[ "${PACK_LINUX:-}" == "1" ]]; then
  echo "→ Removing local .env files from Linux bundle..."
  rm -f \
    "$STAGING_DIR/.env" \
    "$STAGING_DIR/.env.local" \
    "$STAGING_DIR/.env.production" \
    "$STAGING_DIR/.env.production.local" \
    "$STAGING_DIR/.env.development" \
    "$STAGING_DIR/.env.development.local" \
    "$STAGING_DIR/.env.sqlite"
  # Runtime config may contain S3 / SMTP secrets — never ship
  rm -f \
    "$STAGING_DIR/.data/storage-runtime.json" \
    "$STAGING_DIR/.data/email-runtime.json"
fi

# SQLite spare: never ship accidental local DB unless --with-db (seed).
if [[ "${PACK_SQLITE_SPARE:-}" == "1" ]]; then
  mkdir -p "$STAGING_DIR/.data"
  rm -f \
    "$STAGING_DIR/.data/payload.db" \
    "$STAGING_DIR/.data/payload.db-wal" \
    "$STAGING_DIR/.data/payload.db-shm" \
    "$STAGING_DIR/.data/payload.db-journal" || true
  if [[ "${PACK_SQLITE_WITH_DB:-}" == "1" ]]; then
    echo "→ Injecting SQLite seed DB (.data/payload.db)..."
    cp -a ".data/payload.db" "$STAGING_DIR/.data/payload.db"
  else
    echo "→ Skipping SQLite DB (upgrade-safe app pack)"
    cat > "$STAGING_DIR/.data/README.txt" <<'DATAEOF'
Live data lives on the server: .data/payload.db
Upgrade tarballs intentionally omit the DB so extract does not wipe content.
First install: pack with --with-db, or copy payload.db here before ./start.sh
DATAEOF
  fi
fi

echo "→ Copying .next/static..."
mkdir -p "$STAGING_DIR/.next/static"
cp -a "$STATIC_DIR/." "$STAGING_DIR/.next/static/"

if [[ -d "$PUBLIC_DIR" ]]; then
  mkdir -p "$STAGING_DIR/public"
  if [[ "${PACK_LINUX:-}" == "1" ]]; then
    echo "→ Copying public/ (excluding local media uploads)..."
    (cd "$PUBLIC_DIR" && tar cf - --exclude='./media' .) | (cd "$STAGING_DIR/public" && tar xf -)
    mkdir -p "$STAGING_DIR/public/media"
    cat > "$STAGING_DIR/public/media/README.txt" <<'MEDIAEOF'
Local uploads are not bundled in Linux deploy tarballs.
Mount a volume here or configure S3 (see .env.example) for production media.
MEDIAEOF
  else
    echo "→ Copying public/..."
    cp -a "$PUBLIC_DIR/." "$STAGING_DIR/public/"
  fi
fi

if [[ -f ".env.example" ]]; then
  cp ".env.example" "$STAGING_DIR/.env.example"
fi

if [[ "${PACK_LINUX:-}" == "1" ]]; then
  echo "→ Patching native modules for linux/${LINUX_ARCH} (${LINUX_LIBC})..."
  PATCH_SOURCE_NEXT_MODULES="$ROOT_DIR/.next/node_modules" node scripts/patch-standalone-linux-native.mjs "$STAGING_DIR"
  if [[ "${PACK_SQLITE_SPARE:-}" == "1" ]]; then
    cat > "$STAGING_DIR/start.sh" <<'EOF'
#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")"

if [ ! -f .env ]; then
  echo "error: .env missing. Copy .env.example to .env and configure SQLite (see DEPLOY.txt)." >&2
  exit 1
fi

if [ ! -f .data/payload.db ]; then
  echo "error: .data/payload.db missing." >&2
  exit 1
fi

# Drop runtime files that still contain Admin secret masks (••••) — invalid in HTTP headers.
# onInit will rebuild them from enc:v1 ciphertext when PAYLOAD_SECRET matches production.
for f in .data/storage-runtime.json .data/email-runtime.json; do
  if [ -f "$f" ] && grep -q '•' "$f" 2>/dev/null; then
    echo "warning: removing masked secrets from $f (will regenerate on boot)" >&2
    rm -f "$f"
  fi
done

export NODE_ENV="${NODE_ENV:-production}"
export HOSTNAME="${HOSTNAME:-0.0.0.0}"
export PORT="${PORT:-3333}"
# Prefer file env so shell exports cannot override SQLite URL
if node --env-file=.env -e "process.exit(0)" 2>/dev/null; then
  exec node --env-file=.env server.js
fi
exec node server.js
EOF
  else
    cat > "$STAGING_DIR/start.sh" <<'EOF'
#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")"

if [ ! -f .env ]; then
  echo "warning: .env not found. Copy .env.example to .env and configure it." >&2
fi

export NODE_ENV="${NODE_ENV:-production}"
export HOSTNAME="${HOSTNAME:-0.0.0.0}"
export PORT="${PORT:-3333}"

exec node server.js
EOF
  fi
else
  cat > "$STAGING_DIR/start.sh" <<'EOF'
#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")"

if [[ ! -f .env ]]; then
  echo "warning: .env not found. Copy .env.example to .env and configure it." >&2
fi

export NODE_ENV="${NODE_ENV:-production}"
export HOSTNAME="${HOSTNAME:-0.0.0.0}"
export PORT="${PORT:-3333}"

exec node server.js
EOF
fi
chmod +x "$STAGING_DIR/start.sh"

if [[ "${PACK_SQLITE_SPARE:-}" == "1" ]]; then
  cat > "$STAGING_DIR/upgrade.sh" <<'EOF'
#!/usr/bin/env sh
# Upgrade in place without overwriting live SQLite / .env / runtime secrets.
# Usage (from the install dir): ./upgrade.sh /path/to/crispy-*-sqlite-spare-*.tar.gz
set -eu

cd "$(dirname "$0")"
ARCHIVE="${1:-}"
if [ -z "$ARCHIVE" ] || [ ! -f "$ARCHIVE" ]; then
  echo "usage: $0 /path/to/crispy-*-sqlite-spare-*.tar.gz" >&2
  exit 1
fi

echo "→ Extracting $ARCHIVE (preserving .env and .data/payload.db*)..."
tar -xzf "$ARCHIVE" \
  --exclude='.env' \
  --exclude='.data/payload.db' \
  --exclude='.data/payload.db-wal' \
  --exclude='.data/payload.db-shm' \
  --exclude='.data/payload.db-journal' \
  --exclude='.data/storage-runtime.json' \
  --exclude='.data/email-runtime.json'

if [ ! -f .data/payload.db ]; then
  echo "warning: .data/payload.db missing after upgrade — copy a seed DB or re-extract a *-seed-* archive once." >&2
fi

echo "Done. Reload: ./pm2.sh reload   (or ./start.sh)"
EOF
  chmod +x "$STAGING_DIR/upgrade.sh"
fi

if [[ "${PACK_LINUX:-}" == "1" ]]; then
  cat > "$STAGING_DIR/ecosystem.config.cjs" <<'EOF'
/** @type {import('pm2').StartOptions} */
module.exports = {
  apps: [
    {
      name: 'crispy',
      script: './start.sh',
      interpreter: '/bin/sh',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_file: '.env',
      env: {
        NODE_ENV: 'production',
        HOSTNAME: '0.0.0.0',
        PORT: 3333,
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      merge_logs: true,
      time: true,
    },
  ],
}
EOF
else
  cat > "$STAGING_DIR/ecosystem.config.cjs" <<'EOF'
/** @type {import('pm2').StartOptions} */
module.exports = {
  apps: [
    {
      name: 'crispy',
      script: './server.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_file: '.env',
      env: {
        NODE_ENV: 'production',
        HOSTNAME: '0.0.0.0',
        PORT: 3333,
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      merge_logs: true,
      time: true,
    },
  ],
}
EOF
fi

cat > "$STAGING_DIR/pm2.sh" <<'EOF'
#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")"

if ! command -v pm2 >/dev/null 2>&1; then
  echo "error: pm2 not found. Install: npm i -g pm2" >&2
  exit 1
fi

if [[ ! -f .env ]]; then
  echo "warning: .env not found. Copy .env.example to .env and configure it." >&2
fi

mkdir -p logs

ACTION="${1:-start}"

case "$ACTION" in
  start)
    pm2 start ecosystem.config.cjs
    pm2 save
    ;;
  reload)
    pm2 reload ecosystem.config.cjs --update-env
    ;;
  stop)
    pm2 stop crispy
    ;;
  restart)
    pm2 restart crispy --update-env
    ;;
  logs)
    pm2 logs crispy
    ;;
  status)
    pm2 status crispy
    ;;
  *)
    echo "usage: $0 {start|reload|stop|restart|logs|status}" >&2
    exit 1
    ;;
esac
EOF
chmod +x "$STAGING_DIR/pm2.sh"

if [[ "${PACK_SQLITE_SPARE:-}" == "1" ]]; then
  if [[ "${PACK_SQLITE_WITH_DB:-}" == "1" ]]; then
    cat > "$STAGING_DIR/DEPLOY.txt" <<EOF
Crispy SQLite spare-site SEED bundle (linux/${LINUX_ARCH})

Includes app + .data/payload.db. Does NOT include .env (configure on server).
WARNING: Extracting this archive over an existing install WILL overwrite payload.db.
Use only for first install or intentional content replace. For app upgrades, pack
without --with-db (or use upgrade.sh from an app-only archive).

1. First install:
   mkdir -p /opt/crispy && tar -xzf crispy-*-linux-${LINUX_ARCH}-sqlite-spare-seed-*.tar.gz -C /opt/crispy
   cd /opt/crispy

2. Install Node.js 22+ on the server (no Docker).

3. Configure environment (required):
   cp .env.example .env
   # Required for spare:
   #   DATABASE_DRIVER=sqlite
   #   DATABASE_URL=file:./.data/payload.db
   #   DATABASE_PUSH=false
   #   PGVECTOR_ENABLED=false
   #   NEXT_PUBLIC_SERVER_URL=https://your-spare-domain
   #   PAYLOAD_SECRET  ← MUST match the main site (decrypts LLM/S3/email enc:v1 secrets)
   #   CRON_SECRET
   # Do NOT paste Admin •••••••• masks into .env or runtime JSON.

4. If upgrading from an older spare DB that stored masked secrets:
   rm -f .data/storage-runtime.json .data/email-runtime.json
   # Then replace .data/payload.db with a fresh migrate (enc:v1 ciphertext).

5. Start:

   Option A — foreground:
   ./start.sh

   Option B — PM2:
   npm i -g pm2
   ./pm2.sh start

   After first boot, onInit writes storage-runtime.json from DB.
   Restart once more so the S3 plugin picks up credentials:
   ./pm2.sh restart

Notes:
- Encrypted secrets migrate as enc:v1:… ciphertext inside payload.db (not re-typed).
- No db:migrate; schema lives inside payload.db.
- Do not enable DATABASE_PUSH=true on the spare server.
- Rebuild seed locally: pnpm cli db:pg-to-sqlite && pnpm cli dev:pack-sqlite-spare -- --with-db
- App-only upgrades: pnpm cli dev:pack-sqlite-spare  (no --with-db), then ./upgrade.sh archive.tar.gz
EOF
  else
    cat > "$STAGING_DIR/DEPLOY.txt" <<EOF
Crispy SQLite spare-site APP bundle (linux/${LINUX_ARCH})

Includes app only — does NOT include .data/payload.db or .env.
Safe to extract over an existing install without wiping live content.
(Still prefer ./upgrade.sh so .env and runtime JSON are never touched.)

1. Upgrade (recommended):
   cd /opt/crispy
   ./upgrade.sh /path/to/crispy-*-linux-${LINUX_ARCH}-sqlite-spare-*.tar.gz
   ./pm2.sh reload

   Or extract manually (DB not in this archive, so it will not be overwritten):
   tar -xzf crispy-*-linux-${LINUX_ARCH}-sqlite-spare-*.tar.gz -C /opt/crispy

2. First install without a seed archive:
   mkdir -p /opt/crispy && tar -xzf crispy-*-linux-${LINUX_ARCH}-sqlite-spare-*.tar.gz -C /opt/crispy
   cd /opt/crispy
   # Copy .data/payload.db from a seed pack / pg-to-sqlite export onto the server
   cp .env.example .env   # configure SQLite + secrets (see below)
   ./start.sh

3. Configure environment (required):
   #   DATABASE_DRIVER=sqlite
   #   DATABASE_URL=file:./.data/payload.db
   #   DATABASE_PUSH=false
   #   PGVECTOR_ENABLED=false
   #   NEXT_PUBLIC_SERVER_URL=https://your-spare-domain
   #   PAYLOAD_SECRET  ← MUST match the main site
   #   CRON_SECRET

4. Intentional content replace (wipes live DB):
   pnpm cli db:pg-to-sqlite && pnpm cli dev:pack-sqlite-spare -- --with-db
   # Then extract the *-seed-* archive, or replace .data/payload.db only.

Notes:
- No db:migrate; schema lives inside payload.db.
- Do not enable DATABASE_PUSH=true on the spare server.
EOF
  fi
elif [[ "${PACK_LINUX:-}" == "1" ]]; then
  cat > "$STAGING_DIR/DEPLOY.txt" <<EOF
Crispy standalone deployment bundle (linux/${LINUX_ARCH})

1. Upload and extract on the server:
   tar -xzf crispy-*-linux-${LINUX_ARCH}-standalone-*.tar.gz -C /opt/crispy
   cd /opt/crispy

2. Install Node.js 22+ on the server (no Docker required).

3. Configure environment:
   cp .env.example .env
   # Set DATABASE_URL, PAYLOAD_SECRET, NEXT_PUBLIC_SERVER_URL, etc.

4. Run database migrations (from a machine with the full repo, before first start):
   DATABASE_PUSH=false pnpm cli db:migrate

5. Start the app:

   Option A — PM2 (recommended for production):
   npm i -g pm2
   ./pm2.sh start

   Option B — foreground:
   ./start.sh

Notes:
- Built on macOS/Windows with linux/${LINUX_ARCH} (${LINUX_LIBC}) native binaries patched in.
- Override target: LINUX_ARCH=x64|arm64 LINUX_LIBC=glibc|musl pnpm cli dev:pack-linux
- For Alpine/musl set LINUX_LIBC=musl when packing.
- PostgreSQL is required in production; set DATABASE_DRIVER=postgres.
- public/media is excluded from the tarball; mount a volume or use S3 for uploads.
- Local .env is not bundled; copy .env.example to .env on the server and configure secrets there.
EOF
else
  cat > "$STAGING_DIR/DEPLOY.txt" <<'EOF'
Crispy standalone deployment bundle

1. Upload and extract on the server:
   tar -xzf crispy-*-standalone-*.tar.gz -C /opt/crispy
   cd /opt/crispy

2. Configure environment:
   cp .env.example .env
   # Set DATABASE_URL, PAYLOAD_SECRET, NEXT_PUBLIC_SERVER_URL, etc.

3. Run database migrations (from a machine with the full repo, before first start):
   DATABASE_PUSH=false pnpm cli db:migrate

4. Start the app:

   Option A — PM2 (recommended for production):
   npm i -g pm2
   ./pm2.sh start
   pm2 startup    # enable boot on system start (run the printed command)
   pm2 save

   Common PM2 commands:
   ./pm2.sh reload    # zero-downtime reload after deploy
   ./pm2.sh restart
   ./pm2.sh logs
   ./pm2.sh status

   Option B — foreground:
   ./start.sh

Notes:
- Build the tarball on the same OS/CPU as the target server (libsql native bindings when using SQLite).
- PostgreSQL is required in production; set DATABASE_DRIVER=postgres.
- Static files are included under .next/static and public/.
- PM2 logs are written to ./logs/
EOF
fi

echo "→ Creating archive..."
tar -czf "$ARCHIVE_PATH" -C "$STAGING_DIR" .

rm -rf "$STAGING_DIR"

echo ""
echo "Done: $ARCHIVE_PATH"
echo "Size: $(du -h "$ARCHIVE_PATH" | cut -f1)"
echo ""
if [[ "${PACK_SQLITE_SPARE:-}" == "1" ]]; then
  if [[ "${PACK_SQLITE_WITH_DB:-}" == "1" ]]; then
    echo "On spare server (SEED — overwrites payload.db if extracted over existing install):"
    echo "  mkdir -p /opt/crispy && tar -xzf $ARCHIVE_NAME -C /opt/crispy && cd /opt/crispy"
    echo "  cp .env.example .env   # set DATABASE_DRIVER=sqlite, DATABASE_URL=file:./.data/payload.db, secrets"
    echo "  ./start.sh"
  else
    echo "On spare server (APP upgrade — DB not in archive):"
    echo "  cd /opt/crispy && ./upgrade.sh /path/to/$ARCHIVE_NAME && ./pm2.sh reload"
    echo "  # first install: extract, copy payload.db onto server, then cp .env.example .env && ./start.sh"
  fi
else
  echo "On server:"
  echo "  tar -xzf $ARCHIVE_NAME -C /opt/crispy && cd /opt/crispy && cp .env.example .env && ./pm2.sh start"
fi
