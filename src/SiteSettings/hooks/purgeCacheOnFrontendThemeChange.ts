import type { GlobalAfterChangeHook } from 'payload'

import { purgeAllRegisteredCache } from '@/frontend-cache/purge'
import { isFrontendThemeId } from '@/themes/preview.shared'

export const purgeCacheOnFrontendThemeChange: GlobalAfterChangeHook = async ({
  doc,
  previousDoc,
}) => {
  const previousTheme = previousDoc?.frontendTheme
  const nextTheme = doc?.frontendTheme

  if (!isFrontendThemeId(nextTheme)) {
    return doc
  }

  if (!isFrontendThemeId(previousTheme) || previousTheme === nextTheme) {
    return doc
  }

  await purgeAllRegisteredCache()

  return doc
}
