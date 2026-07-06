#!/usr/bin/env bash
# Pack standalone bundle with linux native binaries (no Docker).
# See scripts/patch-standalone-linux-native.mjs

set -euo pipefail

export PACK_LINUX=1
export LINUX_ARCH="${LINUX_ARCH:-x64}"
export LINUX_LIBC="${LINUX_LIBC:-glibc}"

exec "$(dirname "$0")/pack-standalone.sh" "$@"
