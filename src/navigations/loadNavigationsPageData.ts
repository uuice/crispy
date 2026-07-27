import { getAppConfigValue } from '@/config/resolve'
import {
  NAVIGATION_WEBSITES_CONFIG_KEY,
  type NavCategory,
  type NavigationWebsitesConfig,
  type NavigationsPageData,
} from '@/navigations/types'

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
