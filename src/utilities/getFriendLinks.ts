import { getPayload } from 'payload'
import config from '@payload-config'
import type { Link } from '@/payload-types'
import { unstable_cache } from 'next/cache'

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

export const getCachedFriendLinks = unstable_cache(getFriendLinks, ['friend-links'], {
  tags: ['collection_links'],
})
