import type { GlobalAfterChangeHook } from 'payload'

import { resetResolvedCacheSettingsCache } from '@/frontend-cache/getCacheSettings'

export const revalidateCacheSettings: GlobalAfterChangeHook = async ({ context }) => {
  if (context?.disableRevalidate) return

  resetResolvedCacheSettingsCache()
}
