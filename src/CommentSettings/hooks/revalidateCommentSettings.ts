import type { GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateCommentSettings: GlobalAfterChangeHook = ({ context }) => {
  if (context.disableRevalidate) return
  revalidateTag('global_comment-settings', 'max')
}
