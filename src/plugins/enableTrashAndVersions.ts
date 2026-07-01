import type { Plugin } from 'payload'

import {
  defaultCollectionVersions,
  isInternalCollectionSlug,
} from '@/collections/defaults'

/** Enable soft delete and version history on every user-facing collection. */
export function enableTrashAndVersionsPlugin(): Plugin {
  return (config) => ({
    ...config,
    collections: (config.collections ?? []).map((collection) => {
      if (isInternalCollectionSlug(collection.slug)) {
        return collection
      }

      if (collection.trash && collection.versions) {
        return collection
      }

      return {
        ...collection,
        trash: collection.trash ?? true,
        versions: collection.versions ?? defaultCollectionVersions,
      }
    }),
  })
}
