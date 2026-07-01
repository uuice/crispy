import type { Plugin } from 'payload'

import { isInternalCollectionSlug } from '@/collections/defaults'

const LIST_VIEW_COMPONENT = '@/components/AdminListView'

/** Add a refresh control to collection list views (including trash). */
export function enableListRefreshButtonPlugin(): Plugin {
  return (config) => ({
    ...config,
    collections: (config.collections ?? []).map((collection) => {
      if (isInternalCollectionSlug(collection.slug)) {
        return collection
      }

      const existingListComponent = collection.admin?.components?.views?.list?.Component
      if (existingListComponent && existingListComponent !== LIST_VIEW_COMPONENT) {
        return collection
      }

      return {
        ...collection,
        admin: {
          ...collection.admin,
          components: {
            ...collection.admin?.components,
            views: {
              ...collection.admin?.components?.views,
              list: {
                ...collection.admin?.components?.views?.list,
                Component: LIST_VIEW_COMPONENT,
              },
            },
          },
        },
      }
    }),
  })
}
