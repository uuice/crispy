import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { invalidateCachePath, invalidateCacheTag } from '@/frontend-cache/invalidateCache'

import type { Job } from '../../../payload-types'

export const revalidateJob: CollectionAfterChangeHook<Job> = async ({ doc, context }) => {
  if (context.disableRevalidate) return
  await invalidateCacheTag('collection_jobs')
  await invalidateCachePath('/jobs')
  if (doc.slug) {
    await invalidateCachePath(`/jobs/${doc.slug}`)
  }
}

export const revalidateJobDelete: CollectionAfterDeleteHook<Job> = async ({ doc, context }) => {
  if (context.disableRevalidate) return
  await invalidateCacheTag('collection_jobs')
  await invalidateCachePath('/jobs')
  if (doc.slug) {
    await invalidateCachePath(`/jobs/${doc.slug}`)
  }
}
