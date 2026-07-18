import type { CollectionAfterChangeHook } from 'payload'

import { bulkAddGalleryImages } from '@/utilities/bulkAddGalleryImages'

type BulkContext = {
  skipGalleryBulkImages?: boolean
}

/** After save: turn staging bulkImages uploads into gallery-items, then clear the staging field. */
export const syncGalleryBulkImagesAfterChange: CollectionAfterChangeHook = async ({
  doc,
  req,
  context,
}) => {
  const ctx = context as BulkContext
  if (ctx.skipGalleryBulkImages) return doc

  const staging = (doc as { bulkImages?: unknown }).bulkImages
  const mediaIds = Array.isArray(staging) ? staging : []
  if (mediaIds.length === 0) return doc

  await bulkAddGalleryImages({
    payload: req.payload,
    galleryId: doc.id,
    mediaIds,
    req,
  })

  return req.payload.update({
    collection: 'galleries',
    id: doc.id,
    data: { bulkImages: [] },
    depth: 0,
    overrideAccess: true,
    req,
    context: { skipGalleryBulkImages: true },
  })
}
