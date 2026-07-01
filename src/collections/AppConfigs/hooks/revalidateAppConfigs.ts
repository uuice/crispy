import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateAppConfigs: CollectionAfterChangeHook = ({ context }) => {
  if (context.disableRevalidate) return
  revalidateTag('collection_app-configs', 'max')
}

export const revalidateAppConfigsDelete: CollectionAfterDeleteHook = ({ context }) => {
  if (context.disableRevalidate) return
  revalidateTag('collection_app-configs', 'max')
}
