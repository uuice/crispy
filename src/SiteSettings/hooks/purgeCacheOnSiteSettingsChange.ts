import type { GlobalAfterChangeHook } from 'payload'

import type { SiteSetting } from '@/payload-types'
import { purgeAllRegisteredCache } from '@/frontend-cache/purge'
import { isFrontendThemeId } from '@/themes/preview.shared'

function recordSettingsChanged(previous?: SiteSetting['recordSettings'], next?: SiteSetting['recordSettings']) {
  return JSON.stringify(previous ?? null) !== JSON.stringify(next ?? null)
}

export const purgeCacheOnSiteSettingsChange: GlobalAfterChangeHook = async ({ doc, previousDoc }) => {
  const previous = previousDoc as SiteSetting | undefined
  const next = doc as SiteSetting

  const themeChanged =
    isFrontendThemeId(next.frontendTheme) &&
    isFrontendThemeId(previous?.frontendTheme) &&
    previous.frontendTheme !== next.frontendTheme

  const shouldPurge =
    themeChanged ||
    recordSettingsChanged(previous?.recordSettings, next.recordSettings) ||
    previous?.siteName !== next.siteName ||
    previous?.siteDescription !== next.siteDescription

  if (shouldPurge) {
    await purgeAllRegisteredCache()
  }

  return doc
}
