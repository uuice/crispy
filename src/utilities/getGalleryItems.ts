import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import type { GalleryItem } from '@/payload-types'

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'gallery-items',
    depth: 1,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    sort: 'sort',
    where: {
      enabled: {
        equals: true,
      },
    },
  })

  return result.docs
}

export const getCachedGalleryItems = unstable_cache(getGalleryItems, ['gallery-items'], {
  tags: ['collection_gallery-items'],
})
