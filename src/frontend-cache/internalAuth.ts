export const CRISPY_CACHE_INTERNAL_HEADER = 'x-crispy-cache-internal'

export function getCrispyCacheInternalSecret(): string | null {
  return process.env.CRON_SECRET || process.env.PAYLOAD_SECRET || null
}

export function isValidCrispyCacheInternalHeader(headerValue: string | null): boolean {
  const secret = getCrispyCacheInternalSecret()
  if (!secret) return false
  return headerValue === secret
}

export function isValidCrispyCacheInternalRequest(request: Request): boolean {
  return isValidCrispyCacheInternalHeader(request.headers.get(CRISPY_CACHE_INTERNAL_HEADER))
}
