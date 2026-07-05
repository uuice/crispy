import 'server-only'

import { cache } from 'react'

import { getCachedSiteSettings } from '@/utilities/getSiteSettings'

import { getFrontendThemeSelectOptions } from './definitions'
import { loadFrontendTheme } from './loadTheme'
import { getThemePreviewIdFromHeaders } from './preview.server'
import { isFrontendThemeId as isThemePreviewId } from './preview.shared'
import type { FrontendTheme, FrontendThemeId } from './types'

export function isFrontendThemeId(value: string | null | undefined): value is FrontendThemeId {
  return isThemePreviewId(value)
}

export function getFrontendThemeOptions(): { label: string; value: FrontendThemeId }[] {
  return getFrontendThemeSelectOptions()
}

export async function getActiveFrontendThemeId(): Promise<FrontendThemeId> {
  const previewThemeId = await getThemePreviewIdFromHeaders()
  if (previewThemeId) {
    return previewThemeId
  }

  const settings = await getCachedSiteSettings()()
  if (isFrontendThemeId(settings.frontendTheme)) {
    return settings.frontendTheme
  }

  if (isFrontendThemeId(process.env.FRONTEND_THEME)) {
    return process.env.FRONTEND_THEME
  }

  return 'blog'
}

export async function getActiveFrontendTheme(): Promise<FrontendTheme> {
  return getActiveFrontendThemeCached()
}

const getActiveFrontendThemeCached = cache(async (): Promise<FrontendTheme> => {
  const id = await getActiveFrontendThemeId()
  return loadFrontendTheme(id)
})
