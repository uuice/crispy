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

VERSION="$(node -p "require('./package.json').version")"
TIMESTAMP="$(date -u +%Y%m%d%H%M%S)"
LINUX_ARCH="${LINUX_ARCH:-x64}"
LINUX_LIBC="${LINUX_LIBC:-glibc}"
STAGING_DIR="$OUT_DIR/crispy-standalone-$VERSION"
if [[ "${PACK_LINUX:-}" == "1" ]]; then
  ARCHIVE_NAME="crispy-${VERSION}-linux-${LINUX_ARCH}-standalone-${TIMESTAMP}.tar.gz"
else
  ARCHIVE_NAME="crispy-${VERSION}-standalone-${TIMESTAMP}.tar.gz"
fi
ARCHIVE_PATH="$OUT_DIR/$ARCHIVE_NAME"

rm -rf "$STAGING_DIR"
mkdir -p "$STAGING_DIR" "$OUT_DIR"

echo "→ Copying standalone server..."
cp -a "$STANDALONE_DIR/." "$STAGING_DIR/"

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
  node scripts/patch-standalone-linux-native.mjs "$STAGING_DIR"
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

# Fallback for sharp libvips if rpath symlinks are missing
for libdir in node_modules/.pnpm/@img+sharp-libvips-linux-*/node_modules/@img/sharp-libvips-linux-*/lib; do
  if [ -d "$libdir" ]; then
    export LD_LIBRARY_PATH="${libdir}${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
  fi
done

exec node server.js
EOF
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

if [[ "${PACK_LINUX:-}" == "1" ]]; then
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
- Build the tarball on the same OS/CPU as the target server (sharp native bindings).
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
echo "On server:"
echo "  tar -xzf $ARCHIVE_NAME -C /opt/crispy && cd /opt/crispy && cp .env.example .env && ./pm2.sh start"
