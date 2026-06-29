import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateAdSlots: CollectionAfterChangeHook = ({ context }) => {
  if (context.disableRevalidate) return
  revalidateTag('collection_ad-slots')
  revalidateTag('collection_ads')
}

export const revalidateAdSlotsDelete: CollectionAfterDeleteHook = ({ context }) => {
  if (context.disableRevalidate) return
  revalidateTag('collection_ad-slots')
  revalidateTag('collection_ads')
}
