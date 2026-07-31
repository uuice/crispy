#!/usr/bin/env bash
# Cross-compile crispy CLI for macOS / Linux / Windows.
# Usage: ./build-release.sh [version]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

VERSION="${1:-$(git -C ../.. describe --tags --always --dirty 2>/dev/null || echo "0.1.0")}"
OUT="${ROOT}/dist"
LDFLAGS="-s -w -X main.version=${VERSION}"

mkdir -p "$OUT"
rm -f "$OUT"/crispy-*

targets=(
  "darwin amd64"
  "darwin arm64"
  "linux amd64"
  "linux arm64"
  "windows amd64"
  "windows arm64"
)

echo "building crispy ${VERSION}"
for spec in "${targets[@]}"; do
  read -r GOOS GOARCH <<<"$spec"
  ext=""
  if [[ "$GOOS" == "windows" ]]; then
    ext=".exe"
  fi
  name="crispy-${VERSION}-${GOOS}-${GOARCH}${ext}"
  echo "→ ${name}"
  CGO_ENABLED=0 GOOS="$GOOS" GOARCH="$GOARCH" \
    go build -trimpath -ldflags="$LDFLAGS" -o "${OUT}/${name}" .
done

(
  cd "$OUT"
  shasum -a 256 crispy-* > SHA256SUMS
)

echo
echo "artifacts in ${OUT}:"
ls -lh "$OUT"
