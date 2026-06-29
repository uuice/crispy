import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateGalleryItems: CollectionAfterChangeHook = ({ context }) => {
  if (context.disableRevalidate) return

  revalidateTag('collection_gallery-items', 'max')
  revalidatePath('/gallery')
}

export const revalidateGalleryItemsDelete: CollectionAfterDeleteHook = ({ context }) => {
  if (context.disableRevalidate) return

  revalidateTag('collection_gallery-items', 'max')
  revalidatePath('/gallery')
}
