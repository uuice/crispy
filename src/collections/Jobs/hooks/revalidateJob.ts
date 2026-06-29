import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateJob: CollectionAfterChangeHook = ({ doc, req: { context } }) => {
  if (context.disableRevalidate) return doc

  revalidateTag('collection_jobs', 'max')
  revalidatePath('/jobs')
  if (doc.slug) {
    revalidatePath(`/jobs/${doc.slug}`)
  }

  return doc
}

export const revalidateJobDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
  if (context.disableRevalidate) return doc

  revalidateTag('collection_jobs', 'max')
  revalidatePath('/jobs')
  if (doc?.slug) {
    revalidatePath(`/jobs/${doc.slug}`)
  }

  return doc
}
