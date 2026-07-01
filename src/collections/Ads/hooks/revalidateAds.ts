import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { invalidateCacheTag } from '@/frontend-cache/invalidateCache'

export const revalidateAds: CollectionAfterChangeHook = async ({ context }) => {
  if (context.disableRevalidate) return
  await invalidateCacheTag('collection_ads')
}

export const revalidateAdsDelete: CollectionAfterDeleteHook = async ({ context }) => {
  if (context.disableRevalidate) return
  await invalidateCacheTag('collection_ads')
}
