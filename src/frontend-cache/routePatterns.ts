/** Milliseconds before expiresAt to treat an entry as "expiring soon". */
export const CACHE_EXPIRING_SOON_MS = 60 * 60 * 1000

export function matchRoutePattern(pattern: string, routePath: string): boolean {
  const patternParts = pattern.split('/').filter(Boolean)
  const pathParts = routePath.split('/').filter(Boolean)

  if (patternParts.length !== pathParts.length) return false

  return patternParts.every((part, index) => {
    if (part.startsWith('[') && part.endsWith(']')) return true
    return part === pathParts[index]
  })
}

export function isDynamicRoutePath(routePath: string, exactRegistryPaths: ReadonlySet<string>): boolean {
  if (exactRegistryPaths.has(routePath)) return false
  return routePath.length > 0
}
