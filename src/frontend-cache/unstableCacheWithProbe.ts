import { recordDataCacheMiss, recordDataCacheHit } from '@/frontend-cache/dataCacheProbe'
import { withDbCache } from '@/frontend-cache/dbCache'

export function dbCacheWithProbe<T>(
  fn: () => Promise<T>,
  keyParts: string[],
  tags: string[],
  revalidateSeconds?: number,
) {
  const cacheKey = keyParts.join(':')

  return async (): Promise<T> => {
    const result = await withDbCache({
      cacheKey,
      tags,
      ttlSeconds: revalidateSeconds,
      fn: async () => {
        recordDataCacheMiss()
        return fn()
      },
    })

    if (result.status === 'HIT' || result.status === 'STALE') {
      recordDataCacheHit()
    }

    return result.value
  }
}

/** @deprecated Use dbCacheWithProbe */
export const unstableCacheWithProbe = dbCacheWithProbe
