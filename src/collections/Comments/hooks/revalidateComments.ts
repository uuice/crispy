import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateComments: CollectionAfterChangeHook = ({ doc, context }) => {
  if (context.disableRevalidate) return

  revalidateTag('collection_comments', 'max')

  const targetType = doc?.targetType as string | undefined
  const postId = typeof doc?.post === 'object' ? doc.post?.id : doc?.post
  const pageId = typeof doc?.page === 'object' ? doc.page?.id : doc?.page

  if (targetType === 'post' && postId) {
    revalidateTag(`comments_post_${postId}`, 'max')
  }
  if (targetType === 'page' && pageId) {
    revalidateTag(`comments_page_${pageId}`, 'max')
  }
}

export const revalidateCommentsDelete: CollectionAfterDeleteHook = ({ doc, context }) => {
  if (context.disableRevalidate) return

  revalidateTag('collection_comments', 'max')

  const targetType = doc?.targetType as string | undefined
  const postId = typeof doc?.post === 'object' ? doc.post?.id : doc?.post
  const pageId = typeof doc?.page === 'object' ? doc.page?.id : doc?.page

  if (targetType === 'post' && postId) {
    revalidateTag(`comments_post_${postId}`, 'max')
  }
  if (targetType === 'page' && pageId) {
    revalidateTag(`comments_page_${pageId}`, 'max')
  }
}
