import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { invalidateCachePath, invalidateCacheTag } from '@/frontend-cache/invalidateCache'

import type { Post } from '../../../payload-types'

export const revalidatePost: CollectionAfterChangeHook<Post> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/posts/${doc.slug}`

      payload.logger.info(`Revalidating post at path: ${path}`)

      await invalidateCachePath(path)
      await invalidateCacheTag('posts-sitemap')
      await invalidateCacheTag(`posts_${doc.slug}`)
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/posts/${previousDoc.slug}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      await invalidateCachePath(oldPath)
      await invalidateCacheTag('posts-sitemap')
      await invalidateCacheTag(`posts_${previousDoc.slug}`)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = async ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/posts/${doc?.slug}`

    await invalidateCachePath(path)
    await invalidateCacheTag('posts-sitemap')
    if (doc?.slug) await invalidateCacheTag(`posts_${doc.slug}`)
  }

  return doc
}
