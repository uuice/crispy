import type { Plugin } from 'payload'

const QUERY_PRESETS_SLUG = 'payload-query-presets'

/** Enable list query presets on every user-facing collection. */
export function enableQueryPresetsPlugin(): Plugin {
  return (config) => ({
    ...config,
    collections: (config.collections ?? []).map((collection) => {
      if (collection.slug === QUERY_PRESETS_SLUG || collection.enableQueryPresets) {
        return collection
      }

      return {
        ...collection,
        enableQueryPresets: true,
      }
    }),
  })
}
