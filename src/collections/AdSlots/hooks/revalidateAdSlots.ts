import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateAdSlots: CollectionAfterChangeHook = ({ context }) => {
  if (context.disableRevalidate) return
  revalidateTag('collection_ad-slots', 'max')
  revalidateTag('collection_ads', 'max')
}

export const revalidateAdSlotsDelete: CollectionAfterDeleteHook = ({ context }) => {
  if (context.disableRevalidate) return
  revalidateTag('collection_ad-slots', 'max')
  revalidateTag('collection_ads', 'max')
}
