import type { GlobalAfterChangeHook } from 'payload'

import { resetResolvedCacheSettingsCache } from '@/frontend-cache/getCacheSettings'
import { invalidateCacheTag } from '@/frontend-cache/invalidateCache'

export const revalidateCacheSettings: GlobalAfterChangeHook = async ({ context }) => {
  if (context?.disableRevalidate) return

  resetResolvedCacheSettingsCache()
  await invalidateCacheTag('global_cache-settings')
}
