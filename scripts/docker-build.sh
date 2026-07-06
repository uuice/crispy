#!/usr/bin/env bash
# Build a linux/amd64 Docker image for production deployment.
# Uses DOCKER_REGISTRY_PROXY (default: docker.1panel.live) for base image pulls.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PROXY="${DOCKER_REGISTRY_PROXY:-docker.1panel.live}"
NODE_IMAGE="${PROXY}/library/node:22.17.0-alpine"
VERSION="$(node -p "require('./package.json').version")"
TAG="${DOCKER_IMAGE_TAG:-crispy:${VERSION}}"
PLATFORM="${DOCKER_PLATFORM:-linux/amd64}"
OUTPUT="${DOCKER_OUTPUT:-load}"

echo "→ Base image: $NODE_IMAGE"
echo "→ Building $TAG ($PLATFORM)"

BUILD_ARGS=(
  --platform "$PLATFORM"
  --build-arg "NODE_IMAGE=$NODE_IMAGE"
  -t "$TAG"
  -f Dockerfile
  .
)

if [[ "$OUTPUT" == "load" ]]; then
  docker build "${BUILD_ARGS[@]}"
elif [[ "$OUTPUT" == "tar" ]]; then
  TAR_PATH="${DOCKER_TAR_PATH:-dist/crispy-${VERSION}-docker-$(date -u +%Y%m%d%H%M%S).tar}"
  mkdir -p "$(dirname "$TAR_PATH")"
  docker build "${BUILD_ARGS[@]}"
  docker save -o "$TAR_PATH" "$TAG"
  echo ""
  echo "Done: $TAR_PATH"
  echo "Size: $(du -h "$TAR_PATH" | cut -f1)"
  echo ""
  echo "On server: docker load -i $(basename "$TAR_PATH") && docker run -p 3333:3333 --env-file .env $TAG"
else
  echo "error: DOCKER_OUTPUT must be 'load' or 'tar' (got: $OUTPUT)" >&2
  exit 1
fi

if [[ "$OUTPUT" == "load" ]]; then
  echo ""
  echo "Done: $TAG"
  docker images "$TAG"
  echo ""
  echo "Run:"
  echo "  docker run -p 3333:3333 --env-file .env $TAG"
fi
