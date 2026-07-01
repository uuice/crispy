import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { invalidateCacheTag } from '@/frontend-cache/invalidateCache'

export const revalidateComments: CollectionAfterChangeHook = async ({ doc, context }) => {
  if (context.disableRevalidate) return

  await invalidateCacheTag('collection_comments')

  const targetType = doc?.targetType as string | undefined
  const postId = typeof doc?.post === 'object' ? doc.post?.id : doc?.post
  const pageId = typeof doc?.page === 'object' ? doc.page?.id : doc?.page

  if (targetType === 'post' && postId) {
    await invalidateCacheTag(`comments_post_${postId}`)
  }
  if (targetType === 'page' && pageId) {
    await invalidateCacheTag(`comments_page_${pageId}`)
  }
}

export const revalidateCommentsDelete: CollectionAfterDeleteHook = async ({ doc, context }) => {
  if (context.disableRevalidate) return

  await invalidateCacheTag('collection_comments')

  const targetType = doc?.targetType as string | undefined
  const postId = typeof doc?.post === 'object' ? doc.post?.id : doc?.post
  const pageId = typeof doc?.page === 'object' ? doc.page?.id : doc?.page

  if (targetType === 'post' && postId) {
    await invalidateCacheTag(`comments_post_${postId}`)
  }
  if (targetType === 'page' && pageId) {
    await invalidateCacheTag(`comments_page_${pageId}`)
  }
}
