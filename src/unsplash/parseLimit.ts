const DEFAULT_UNSPLASH_PAGE_SIZE = 20
const MAX_UNSPLASH_PAGE_SIZE = 30

export function parseUnsplashLimit(value: unknown, fallback = DEFAULT_UNSPLASH_PAGE_SIZE): number {
  const parsed = Number.parseInt(String(value ?? ''), 10)
  if (!Number.isFinite(parsed)) {
    return fallback
  }

  return Math.min(Math.max(parsed, 1), MAX_UNSPLASH_PAGE_SIZE)
}

export { DEFAULT_UNSPLASH_PAGE_SIZE, MAX_UNSPLASH_PAGE_SIZE }
