import type { Metadata } from 'next'

import navigationData from '@/data/navigationWebsiteData.json'

import { NavigationsView } from '../views/NavigationsView'

type NavSite = {
  id: string
  title: string
  description?: string
  url: string
}

export type NavCategory = {
  id: string
  name: string
  description?: string
  websites: NavSite[]
}

export type NavigationsPageData = {
  categories: NavCategory[]
  totalSites: number
}

export async function loadNavigationsPageData(): Promise<NavigationsPageData> {
  const categories = (navigationData as { categories: NavCategory[] }).categories
  const totalSites = categories.reduce((sum, c) => sum + c.websites.length, 0)

  return { categories, totalSites }
}

export function navigationsPageMetadata(): Metadata {
  return { title: '类库导航' }
}

export const navigationsPage = {
  load: loadNavigationsPageData,
  View: NavigationsView,
  metadata: navigationsPageMetadata,
}
