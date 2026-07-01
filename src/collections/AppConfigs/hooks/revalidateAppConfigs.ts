import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { invalidateCacheTag } from '@/frontend-cache/invalidateCache'

export const revalidateAppConfigs: CollectionAfterChangeHook = async ({ context }) => {
  if (context.disableRevalidate) return
  await invalidateCacheTag('collection_app-configs')
}

export const revalidateAppConfigsDelete: CollectionAfterDeleteHook = async ({ context }) => {
  if (context.disableRevalidate) return
  await invalidateCacheTag('collection_app-configs')
}
