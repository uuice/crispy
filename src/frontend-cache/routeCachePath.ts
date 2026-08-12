/** Query keys that must not create separate HTML cache variants. */
const IGNORED_QUERY_KEYS = new Set([
  'theme_preview',
  'nocache',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'fbclid',
  'gclid',
])

/**
 * Build the route cache identity for a request.
 * Pathname alone is not enough — list pages use ?page= and must not share one HTML blob.
 */
export function buildRouteCachePath(pathname: string, search: string = ''): string {
  const raw = search.startsWith('?') ? search.slice(1) : search
  const params = new URLSearchParams(raw)

  for (const key of [...params.keys()]) {
    if (IGNORED_QUERY_KEYS.has(key) || key.startsWith('utm_')) {
      params.delete(key)
    }
  }

  const sorted = new URLSearchParams()
  for (const key of [...params.keys()].sort()) {
    for (const value of params.getAll(key)) {
      sorted.append(key, value)
    }
  }

  const query = sorted.toString()
  return query ? `${pathname}?${query}` : pathname
}

/** Strip query for pattern matching / base-path purge. */
export function routeCachePathname(routePath: string): string {
  const index = routePath.indexOf('?')
  return index >= 0 ? routePath.slice(0, index) : routePath
}
