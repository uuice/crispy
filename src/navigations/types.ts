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
