import type { CollectionAfterChangeHook, CollectionBeforeChangeHook } from 'payload'

import { bulkAddGalleryImages } from '@/utilities/bulkAddGalleryImages'

type GalleryBulkContext = {
  galleryBulkMediaIds?: unknown
}

/** Stash bulkImages IDs and clear staging field before write (avoids a second update). */
export const stashGalleryBulkImagesBeforeChange: CollectionBeforeChangeHook = ({
  data,
  context,
}) => {
  const staging = data?.bulkImages
  if (!Array.isArray(staging) || staging.length === 0) return data

  ;(context as GalleryBulkContext).galleryBulkMediaIds = staging
  return {
    ...data,
    bulkImages: [],
  }
}

/** Create gallery-items from stashed bulkImages; return a fresh doc for Admin form. */
export const syncGalleryBulkImagesAfterChange: CollectionAfterChangeHook = async ({
  doc,
  req,
  context,
  overrideAccess,
}) => {
  const mediaIds = (context as GalleryBulkContext).galleryBulkMediaIds
  if (!Array.isArray(mediaIds) || mediaIds.length === 0) return doc

  await bulkAddGalleryImages({
    payload: req.payload,
    galleryId: doc.id,
    mediaIds,
    req,
  })

  try {
    return await req.payload.findByID({
      collection: 'galleries',
      id: doc.id,
      depth: 1,
      draft: false,
      overrideAccess: overrideAccess ?? true,
      req,
    })
  } catch {
    return doc
  }
}
