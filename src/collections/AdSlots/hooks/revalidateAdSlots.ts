import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { invalidateCacheTag } from '@/frontend-cache/invalidateCache'

export const revalidateAdSlots: CollectionAfterChangeHook = async ({ context }) => {
  if (context.disableRevalidate) return
  await invalidateCacheTag('collection_ad-slots')
  await invalidateCacheTag('collection_ads')
}

export const revalidateAdSlotsDelete: CollectionAfterDeleteHook = async ({ context }) => {
  if (context.disableRevalidate) return
  await invalidateCacheTag('collection_ad-slots')
  await invalidateCacheTag('collection_ads')
}
