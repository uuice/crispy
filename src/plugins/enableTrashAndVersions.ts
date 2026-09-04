import type { Plugin } from 'payload'

import { isInternalCollectionSlug } from '@/collections/defaults'

/**
 * Enable soft delete on every user-facing collection.
 * Version history is opt-in on the Collection (drafts for posts/pages).
 * Do not blanket-enable versions: each save would duplicate rows in `_v` tables.
 */
export function enableTrashAndVersionsPlugin(): Plugin {
  return (config) => ({
    ...config,
    collections: (config.collections ?? []).map((collection) => {
      if (isInternalCollectionSlug(collection.slug)) {
        return collection
      }

      if (collection.trash != null) {
        return collection
      }

      return {
        ...collection,
        trash: true,
      }
    }),
  })
}
