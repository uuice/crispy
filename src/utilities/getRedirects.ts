import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { dbCacheWithProbe } from '@/frontend-cache/unstableCacheWithProbe'

export async function getRedirects(depth = 1) {
  const payload = await getPayload({ config: configPromise })

  const { docs: redirects } = await payload.find({
    collection: 'redirects',
    depth,
    limit: 0,
    pagination: false,
  })

  return redirects
}

/**
 * Cache all redirects together to avoid multiple fetches.
 */
export const getCachedRedirects = () =>
  dbCacheWithProbe(async () => getRedirects(), ['redirects'], ['redirects'])
