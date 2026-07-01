import type { GlobalAfterChangeHook } from 'payload'

import { invalidateCacheTag } from '@/frontend-cache/invalidateCache'

export const revalidateFooter: GlobalAfterChangeHook = async ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating footer`)

    await invalidateCacheTag('global_footer')
  }

  return doc
}
