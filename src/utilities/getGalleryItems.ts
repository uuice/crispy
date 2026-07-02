import { getPayload } from 'payload'
import config from '@payload-config'

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

export const getCachedGalleryItems = getGalleryItems
