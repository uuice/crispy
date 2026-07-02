import { discoverFrontendRouteEntries } from './discoverFrontendRoutes'

export type FrontendCacheKind = 'path'

export type FrontendCachePathMatch = 'exact' | 'pattern'

export type FrontendCacheGroup = 'page' | 'route' | 'dynamic'

export type FrontendCacheEntry = {
  id: string
  label: string
  description?: string
  group: FrontendCacheGroup
  kind: FrontendCacheKind
  /** URL path or dynamic pattern */
  target: string
  pathType?: 'page' | 'layout'
  pathMatch?: FrontendCachePathMatch
}

/** Routes auto-discovered from app/(frontend) page.tsx and route.ts handlers. */
export function getFrontendCacheRegistry(): FrontendCacheEntry[] {
  return discoverFrontendRouteEntries()
}

export function getCacheEntryById(id: string): FrontendCacheEntry | undefined {
  return getFrontendCacheRegistry().find((entry) => entry.id === id)
}

export function resolveCacheEntries(ids: string[]): FrontendCacheEntry[] {
  const unique = [...new Set(ids)]
  return unique
    .map((id) => getCacheEntryById(id))
    .filter((entry): entry is FrontendCacheEntry => Boolean(entry))
}

export const FRONTEND_CACHE_GROUP_LABELS: Record<FrontendCacheGroup, string> = {
  page: '前台页面',
  route: '路由',
  dynamic: '动态路由',
}

export function getExactRegistryRoutePaths(): Set<string> {
  return new Set(
    getFrontendCacheRegistry()
      .filter((entry) => (entry.pathMatch ?? 'exact') === 'exact')
      .map((entry) => entry.target),
  )
}
