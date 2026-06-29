import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateLinks: CollectionAfterChangeHook = ({ context }) => {
  if (context.disableRevalidate) return
  revalidateTag('collection_links')
}

export const revalidateLinksDelete: CollectionAfterDeleteHook = ({ context }) => {
  if (context.disableRevalidate) return
  revalidateTag('collection_links')
}
