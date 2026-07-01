export const CRISPY_CACHE_HEADERS = {
  page: 'X-Crispy-Page-Cache',
  data: 'X-Crispy-Data-Cache',
  ttl: 'X-Crispy-Cache-TTL',
  enabled: 'X-Crispy-Cache-Enabled',
  mode: 'X-Crispy-Cache-Mode',
} as const

export type CrispyCacheStatus = 'HIT' | 'MISS' | 'STALE' | 'BYPASS'

export type CrispyCacheHeaderValues = {
  pageStatus: CrispyCacheStatus
  dataStatus: CrispyCacheStatus
  ttlSeconds: number
  cachingEnabled: boolean
}

export function applyCrispyCacheHeaders(
  headers: Headers,
  values: CrispyCacheHeaderValues,
): void {
  headers.set(CRISPY_CACHE_HEADERS.page, values.pageStatus)
  headers.set(CRISPY_CACHE_HEADERS.data, values.dataStatus)
  headers.set(CRISPY_CACHE_HEADERS.ttl, String(values.ttlSeconds))
  headers.set(CRISPY_CACHE_HEADERS.enabled, values.cachingEnabled ? 'true' : 'false')
  headers.set(
    CRISPY_CACHE_HEADERS.mode,
    values.cachingEnabled ? 'database' : 'disabled',
  )
}

export function appendCrispyCacheHeadersToResponse(
  response: Response,
  values: CrispyCacheHeaderValues,
): Response {
  applyCrispyCacheHeaders(response.headers, values)
  return response
}
