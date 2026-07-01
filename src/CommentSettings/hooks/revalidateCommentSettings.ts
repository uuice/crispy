import type { GlobalAfterChangeHook } from 'payload'

import { invalidateCacheTag } from '@/frontend-cache/invalidateCache'

export const revalidateCommentSettings: GlobalAfterChangeHook = async ({ context }) => {
  if (context.disableRevalidate) return
  await invalidateCacheTag('global_comment-settings')
}
