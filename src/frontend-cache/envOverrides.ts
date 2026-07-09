import type { ResolvedCacheSettings } from '@/frontend-cache/settings'

/** Dev-only override from CRISPY_FRONTEND_HTML_CACHE; ignored in production. */
export function parseDevHtmlCacheEnvOverride(): boolean | null {
  if (process.env.NODE_ENV === 'production') return null

  const raw = process.env.CRISPY_FRONTEND_HTML_CACHE?.trim().toLowerCase()
  if (!raw) return null

  if (raw === 'true' || raw === '1' || raw === 'yes' || raw === 'on') return true
  if (raw === 'false' || raw === '0' || raw === 'no' || raw === 'off') return false

  return null
}

export function applyDevHtmlCacheEnvOverride(
  settings: ResolvedCacheSettings,
): ResolvedCacheSettings {
  const forced = parseDevHtmlCacheEnvOverride()
  if (forced === null) return settings

  return {
    ...settings,
    cachingEnabled: forced,
  }
}
