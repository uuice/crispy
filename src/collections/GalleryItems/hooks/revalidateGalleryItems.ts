import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { invalidateCachePath, invalidateCacheTag } from '@/frontend-cache/invalidateCache'

export const revalidateGalleryItems: CollectionAfterChangeHook = async ({ context }) => {
  if (context.disableRevalidate) return
  await invalidateCacheTag('collection_gallery-items')
  await invalidateCachePath('/gallery')
}

export const revalidateGalleryItemsDelete: CollectionAfterDeleteHook = async ({ context }) => {
  if (context.disableRevalidate) return
  await invalidateCacheTag('collection_gallery-items')
  await invalidateCachePath('/gallery')
}
