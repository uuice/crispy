import type { GlobalAfterChangeHook } from 'payload'

import type { SiteSetting } from '@/payload-types'
import { purgeAllRegisteredCache } from '@/frontend-cache/purge'

function recordSettingsChanged(previous?: SiteSetting['recordSettings'], next?: SiteSetting['recordSettings']) {
  return JSON.stringify(previous ?? null) !== JSON.stringify(next ?? null)
}

export const purgeCacheOnSiteSettingsChange: GlobalAfterChangeHook = async ({ doc, previousDoc }) => {
  const previous = previousDoc as SiteSetting | undefined
  const next = doc as SiteSetting

  const shouldPurge =
    recordSettingsChanged(previous?.recordSettings, next.recordSettings) ||
    previous?.siteName !== next.siteName ||
    previous?.siteDescription !== next.siteDescription ||
    previous?.showNovelUpdatesOnHome !== next.showNovelUpdatesOnHome

  if (shouldPurge) {
    await purgeAllRegisteredCache()
  }

  return doc
}
