import {
  DEFAULT_DATA_CACHE_REVALIDATE,
  DEFAULT_PAGE_REVALIDATE,
} from '@/frontend-cache/constants'

/** Edge-safe cache settings shape (no Payload imports). */
export type ResolvedCacheSettings = {
  cachingEnabled: boolean
  pageRevalidateSeconds: number
  dataCacheRevalidateSeconds: number
  exposeCacheHeaders: boolean
}

export const DEFAULT_CACHE_SETTINGS: ResolvedCacheSettings = {
  cachingEnabled: true,
  pageRevalidateSeconds: DEFAULT_PAGE_REVALIDATE,
  dataCacheRevalidateSeconds: DEFAULT_DATA_CACHE_REVALIDATE,
  exposeCacheHeaders: true,
}

export function normalizeCacheSettings(
  settings?: Partial<ResolvedCacheSettings> | null,
): ResolvedCacheSettings {
  return {
    cachingEnabled: settings?.cachingEnabled ?? DEFAULT_CACHE_SETTINGS.cachingEnabled,
    pageRevalidateSeconds:
      settings?.pageRevalidateSeconds ?? DEFAULT_CACHE_SETTINGS.pageRevalidateSeconds,
    dataCacheRevalidateSeconds:
      settings?.dataCacheRevalidateSeconds ?? DEFAULT_CACHE_SETTINGS.dataCacheRevalidateSeconds,
    exposeCacheHeaders: settings?.exposeCacheHeaders ?? DEFAULT_CACHE_SETTINGS.exposeCacheHeaders,
  }
}
