import type { GlobalAfterChangeHook } from 'payload'

import { invalidateCacheTag } from '@/frontend-cache/invalidateCache'

export const revalidateHeader: GlobalAfterChangeHook = async ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating header`)

    await invalidateCacheTag('global_header')
  }

  return doc
}
