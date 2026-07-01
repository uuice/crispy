import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { invalidateCachePath, invalidateCacheTag } from '@/frontend-cache/invalidateCache'

import type { Page } from '../../../payload-types'

export const revalidatePage: CollectionAfterChangeHook<Page> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = doc.slug === 'home' ? '/' : `/${doc.slug}`

      payload.logger.info(`Revalidating page at path: ${path}`)

      await invalidateCachePath(path)
      await invalidateCacheTag('pages-sitemap')
      await invalidateCacheTag(`pages_${doc.slug}`)
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`

      payload.logger.info(`Revalidating old page at path: ${oldPath}`)

      await invalidateCachePath(oldPath)
      await invalidateCacheTag('pages-sitemap')
      await invalidateCacheTag(`pages_${previousDoc.slug}`)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = async ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`
    await invalidateCachePath(path)
    await invalidateCacheTag('pages-sitemap')
    if (doc?.slug) await invalidateCacheTag(`pages_${doc.slug}`)
  }

  return doc
}
