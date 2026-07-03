import { cache } from 'react'

import { getCachedSiteSettings } from '@/utilities/getSiteSettings'

import { blogTheme } from './blog'
import { FRONTEND_THEME_IDS } from './definitions'
import type { FrontendTheme, FrontendThemeId } from './types'

export const frontendThemes = {
  blog: blogTheme,
} as const satisfies Record<FrontendThemeId, FrontendTheme>

export function isFrontendThemeId(value: string | null | undefined): value is FrontendThemeId {
  return value != null && (FRONTEND_THEME_IDS as readonly string[]).includes(value)
}

export function getFrontendThemeOptions(): { label: string; value: FrontendThemeId }[] {
  return Object.values(frontendThemes).map((theme) => ({
    label: theme.label,
    value: theme.id,
  }))
}

export async function getActiveFrontendThemeId(): Promise<FrontendThemeId> {
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
  return frontendThemes[id]
})
