import { touchRouteCacheEntry } from '@/frontend-cache/dbCache'
import type { CrispyCacheStatus } from '@/frontend-cache/headers'

export type RouteCacheTouchRequest = {
  routePath: string
  ttlSeconds: number
  cachingEnabled: boolean
  bypass: boolean
}

export async function resolveRouteCacheStatusFromDb(
  request: RouteCacheTouchRequest,
): Promise<CrispyCacheStatus> {
  return touchRouteCacheEntry(request)
}
