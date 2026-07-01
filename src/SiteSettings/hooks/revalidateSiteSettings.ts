import type { GlobalAfterChangeHook } from 'payload'

import { invalidateCachePath, invalidateCacheTag } from '@/frontend-cache/invalidateCache'

export const revalidateSiteSettings: GlobalAfterChangeHook = async ({ context }) => {
  if (context.disableRevalidate) {
    return
  }

  await invalidateCacheTag('global_site-settings')
  await invalidateCachePath('/')
}
