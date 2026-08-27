import { getAppConfigValue } from '@/config/resolve'

export type NavSite = {
  id: string
  title: string
  description?: string
  url: string
  icon?: string
  tags?: string[]
}

export type NavCategory = {
  id: string
  name: string
  description?: string
  websites: NavSite[]
}

export type NavigationWebsitesConfig = {
  categories: NavCategory[]
}

export type NavigationsPageData = {
  categories: NavCategory[]
  totalSites: number
}

/** AppConfigs key for the navigations page (valueType: json). */
export const NAVIGATION_WEBSITES_CONFIG_KEY = 'navigation.websites'

function isNavCategory(value: unknown): value is NavCategory {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  return (
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    Array.isArray(item.websites)
  )
}

export function normalizeNavigationWebsitesConfig(
  value: unknown,
): NavigationWebsitesConfig | null {
  if (!value || typeof value !== 'object') return null
  const categories = (value as { categories?: unknown }).categories
  if (!Array.isArray(categories)) return null

  const normalized = categories.filter(isNavCategory)
  if (normalized.length === 0) return null

  return { categories: normalized }
}

export function toNavigationsPageData(config: NavigationWebsitesConfig): NavigationsPageData {
  const { categories } = config
  const totalSites = categories.reduce((sum, cat) => sum + cat.websites.length, 0)
  return { categories, totalSites }
}

/** Load navigations page data from app-configs (`navigation.websites`) only. */
export async function loadNavigationsPageData(): Promise<NavigationsPageData> {
  const raw = await getAppConfigValue(NAVIGATION_WEBSITES_CONFIG_KEY)
  const fromDb = normalizeNavigationWebsitesConfig(raw)
  return toNavigationsPageData(fromDb ?? { categories: [] })
}
