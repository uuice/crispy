import 'server-only'

import { headers } from 'next/headers'

import type { FrontendThemeId } from './definitions'
import { isFrontendThemeId, THEME_PREVIEW_REQUEST_HEADER } from './preview.shared'

export async function getThemePreviewIdFromHeaders(): Promise<FrontendThemeId | null> {
  try {
    const headerStore = await headers()
    const value = headerStore.get(THEME_PREVIEW_REQUEST_HEADER)
    return isFrontendThemeId(value) ? value : null
  } catch {
    // headers() is unavailable during generateStaticParams / build-time rendering.
    return null
  }
}
