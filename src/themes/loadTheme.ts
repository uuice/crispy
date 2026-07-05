import 'server-only'

import { cache } from 'react'

import type { FrontendTheme, FrontendThemeId } from './types'

/** Explicit loaders — one async JS chunk per theme (CSS via /theme-assets/{id}.css link). */
const themeLoaders: Record<FrontendThemeId, () => Promise<FrontendTheme>> = {
  blog: async () => (await import('./blog')).blogTheme,
  cms: async () => (await import('./cms')).cmsTheme,
  kb: async () => (await import('./kb')).kbTheme,
}

export const loadFrontendTheme = cache(async (id: FrontendThemeId): Promise<FrontendTheme> => {
  return themeLoaders[id]()
})
