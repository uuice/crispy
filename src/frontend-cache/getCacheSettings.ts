import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { DEFAULT_CACHE_SETTINGS, normalizeCacheSettings, type ResolvedCacheSettings } from '@/frontend-cache/settings'

export type { ResolvedCacheSettings } from '@/frontend-cache/settings'
export { DEFAULT_CACHE_SETTINGS, normalizeCacheSettings } from '@/frontend-cache/settings'

let cachedSettings: ResolvedCacheSettings | null = null
let cachedAt = 0
const SETTINGS_TTL_MS = 60_000

/** Read cache-settings global directly (not via DB cache — avoids circular dependency). */
export async function getResolvedCacheSettings(): Promise<ResolvedCacheSettings> {
  if (cachedSettings && Date.now() - cachedAt < SETTINGS_TTL_MS) {
    return cachedSettings
  }

  const payload = await getPayload({ config: configPromise })
  const settings = await payload.findGlobal({
    slug: 'cache-settings',
    overrideAccess: true,
  })

  cachedSettings = normalizeCacheSettings({
    cachingEnabled: settings.cachingEnabled ?? undefined,
    pageRevalidateSeconds: settings.pageRevalidateSeconds ?? undefined,
    exposeCacheHeaders: settings.exposeCacheHeaders ?? undefined,
  })
  cachedAt = Date.now()
  return cachedSettings
}

export function resetResolvedCacheSettingsCache(): void {
  cachedSettings = null
  cachedAt = 0
}
