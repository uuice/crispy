import type { Metadata } from 'next'

import { getCachedSiteSettings } from '@/utilities/getSiteSettings'

import type { PostListItem, SidebarCategory } from '../data/types'
import { queryPosts, querySidebarData } from '../data/queries'
import { HomeView } from '../views/HomeView'

export type HomePageData = {
  siteName: string
  siteDescription?: string
  posts: PostListItem[]
  categories: SidebarCategory[]
}

export async function loadHomePageData(): Promise<HomePageData> {
  const [settings, posts, sidebar] = await Promise.all([
    getCachedSiteSettings()(),
    queryPosts(),
    querySidebarData(),
  ])

  return {
    siteName: settings.siteName || 'Crispy',
    siteDescription: settings.siteDescription || undefined,
    posts,
    categories: sidebar.categories,
  }
}

export async function homePageMetadata(): Promise<Metadata> {
  const settings = await getCachedSiteSettings()()
  return {
    title: settings.siteName || 'Crispy',
    description: settings.siteDescription || undefined,
  }
}

export const homePage = {
  load: loadHomePageData,
  View: HomeView,
  metadata: homePageMetadata,
}
