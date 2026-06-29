import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateAds: CollectionAfterChangeHook = ({ context }) => {
  if (context.disableRevalidate) return
  revalidateTag('collection_ads')
}

export const revalidateAdsDelete: CollectionAfterDeleteHook = ({ context }) => {
  if (context.disableRevalidate) return
  revalidateTag('collection_ads')
}
