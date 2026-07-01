import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { invalidateCacheTag } from '@/frontend-cache/invalidateCache'

export const revalidateLinks: CollectionAfterChangeHook = async ({ context }) => {
  if (context.disableRevalidate) return
  await invalidateCacheTag('collection_links')
}

export const revalidateLinksDelete: CollectionAfterDeleteHook = async ({ context }) => {
  if (context.disableRevalidate) return
  await invalidateCacheTag('collection_links')
}
