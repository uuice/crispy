#!/usr/bin/env bash
# Pack Next.js standalone for Linux servers (no Docker on build machine).
#
# Invoked by: pnpm cli dev:pack-linux | pnpm cli dev:pack-linux-standalone
#
# ── Environment variables ─────────────────────────────────────────────────────
#
# PACK_LINUX=1
#   Required for Linux deploy mode. Set automatically by this script.
#   Effects (in pack-standalone.sh + patch-standalone-linux-native.mjs):
#     - Exclude public/media uploads from the tarball
#     - Replace darwin native modules with Linux binaries (sharp, libsql)
#     - Prune non-target platforms and dev-only packages (playwright, vitest…)
#
# LINUX_ARCH (default: x64)
#   Target CPU architecture on the server.
#     x64   — most cloud VPS / amd64 (Ubuntu, Debian, CentOS, etc.)
#     arm64 — AWS Graviton, Apple Silicon Linux VMs, Ampere
#   Example: LINUX_ARCH=arm64 pnpm cli dev:pack-linux
#
# LINUX_LIBC (default: glibc)
#   Target C standard library on the server.
#     glibc — Ubuntu, Debian, CentOS, RHEL (default)
#     musl  — Alpine Linux containers
#   Example: LINUX_LIBC=musl pnpm cli dev:pack-linux
#
# Combined example (Alpine on ARM):
#   LINUX_ARCH=arm64 LINUX_LIBC=musl pnpm cli dev:pack-linux
#
# See also: scripts/patch-standalone-linux-native.mjs

set -euo pipefail

export PACK_LINUX=1
export LINUX_ARCH="${LINUX_ARCH:-x64}"
export LINUX_LIBC="${LINUX_LIBC:-glibc}"

case "$LINUX_ARCH" in
  x64|arm64) ;;
  *)
    echo "error: unsupported LINUX_ARCH='$LINUX_ARCH' (use x64 or arm64)" >&2
    exit 1
    ;;
esac

case "$LINUX_LIBC" in
  glibc|musl) ;;
  *)
    echo "error: unsupported LINUX_LIBC='$LINUX_LIBC' (use glibc or musl)" >&2
    exit 1
    ;;
esac

echo "→ Linux pack target: LINUX_ARCH=${LINUX_ARCH}, LINUX_LIBC=${LINUX_LIBC}"

exec "$(dirname "$0")/pack-standalone.sh" "$@"
