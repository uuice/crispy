import type { CollectionAfterChangeHook } from 'payload'

import { invalidateCacheTag } from '@/frontend-cache/invalidateCache'

export const revalidateRedirects: CollectionAfterChangeHook = async ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating redirects`)

  await invalidateCacheTag('redirects')

  return doc
}
