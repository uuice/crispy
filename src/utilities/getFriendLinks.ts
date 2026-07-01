import { getPayload } from 'payload'
import config from '@payload-config'
import type { Link } from '@/payload-types'

import { dbCacheWithProbe } from '@/frontend-cache/unstableCacheWithProbe'

export async function getFriendLinks(): Promise<Link[]> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'links',
    depth: 1,
    limit: 50,
    pagination: false,
    sort: 'sort',
    where: {
      enabled: { equals: true },
    },
  })

  return result.docs
}

export const getCachedFriendLinks = dbCacheWithProbe(
  getFriendLinks,
  ['friend-links'],
  ['friend-links', 'collection_links'],
)
