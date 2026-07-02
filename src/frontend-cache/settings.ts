import { DEFAULT_PAGE_REVALIDATE } from '@/frontend-cache/constants'

/** Edge-safe cache settings shape (no Payload imports). */
export type ResolvedCacheSettings = {
  cachingEnabled: boolean
  pageRevalidateSeconds: number
  exposeCacheHeaders: boolean
}

export const DEFAULT_CACHE_SETTINGS: ResolvedCacheSettings = {
  cachingEnabled: true,
  pageRevalidateSeconds: DEFAULT_PAGE_REVALIDATE,
  exposeCacheHeaders: true,
}

export function normalizeCacheSettings(
  settings?: Partial<ResolvedCacheSettings> | null,
): ResolvedCacheSettings {
  return {
    cachingEnabled: settings?.cachingEnabled ?? DEFAULT_CACHE_SETTINGS.cachingEnabled,
    pageRevalidateSeconds:
      settings?.pageRevalidateSeconds ?? DEFAULT_CACHE_SETTINGS.pageRevalidateSeconds,
    exposeCacheHeaders: settings?.exposeCacheHeaders ?? DEFAULT_CACHE_SETTINGS.exposeCacheHeaders,
  }
}
