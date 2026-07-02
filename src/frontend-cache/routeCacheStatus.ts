import { resolveRouteCacheFromDb, type RouteCacheLookupResult } from '@/frontend-cache/dbCache'

export type RouteCacheTouchRequest = {
  routePath: string
  ttlSeconds: number
  cachingEnabled: boolean
  bypass: boolean
}

export async function resolveRouteCacheFromDbRequest(
  request: RouteCacheTouchRequest,
): Promise<RouteCacheLookupResult> {
  return resolveRouteCacheFromDb(request)
}
