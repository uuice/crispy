import { getResolvedCacheSettings } from '@/frontend-cache/getCacheSettings'
import { appendCrispyCacheHeadersToResponse } from '@/frontend-cache/headers'
import type { ResolvedCacheSettings } from '@/frontend-cache/settings'

export async function withRouteCacheHeaders(
  response: Response,
  settings?: ResolvedCacheSettings,
): Promise<Response> {
  const resolved = settings ?? (await getResolvedCacheSettings())

  if (!resolved.exposeCacheHeaders) {
    return response
  }

  return appendCrispyCacheHeadersToResponse(response, {
    pageStatus: 'BYPASS',
    dataStatus: 'BYPASS',
    ttlSeconds: resolved.pageRevalidateSeconds,
    cachingEnabled: resolved.cachingEnabled,
  })
}
