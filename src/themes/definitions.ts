export const FRONTEND_THEME_DEFINITIONS = [
  { id: 'blog', label: '博客皮肤' },
  { id: 'cms', label: '通用 CMS' },
] as const

export type FrontendThemeId = (typeof FRONTEND_THEME_DEFINITIONS)[number]['id']

export const FRONTEND_THEME_IDS = FRONTEND_THEME_DEFINITIONS.map((item) => item.id)

export function getFrontendThemeDefinition(id: FrontendThemeId) {
  const definition = FRONTEND_THEME_DEFINITIONS.find((item) => item.id === id)
  if (!definition) {
    throw new Error(`Unknown frontend theme: ${id}`)
  }

  return definition
}

export function getFrontendThemeSelectOptions(): { label: string; value: FrontendThemeId }[] {
  return FRONTEND_THEME_DEFINITIONS.map((item) => ({
    label: item.label,
    value: item.id,
  }))
}
