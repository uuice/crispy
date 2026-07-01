import {
  appendCrispyCacheHeadersToResponse,
  type CrispyCacheStatus,
} from '@/frontend-cache/headers'
import {
  getResolvedCacheSettings,
  type ResolvedCacheSettings,
} from '@/frontend-cache/getCacheSettings'

export async function withRouteCacheHeaders(
  response: Response,
  dataStatus: CrispyCacheStatus,
  settings?: ResolvedCacheSettings,
): Promise<Response> {
  const resolved = settings ?? (await getResolvedCacheSettings())

  if (!resolved.exposeCacheHeaders) {
    return response
  }

  return appendCrispyCacheHeadersToResponse(response, {
    pageStatus: 'BYPASS',
    dataStatus,
    ttlSeconds: resolved.pageRevalidateSeconds,
    cachingEnabled: resolved.cachingEnabled,
  })
}
