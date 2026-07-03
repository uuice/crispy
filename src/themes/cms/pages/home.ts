import type { Metadata } from 'next'

import { getCachedSiteSettings } from '@/utilities/getSiteSettings'

import type { PostListItem } from '../data/types'
import { queryPosts } from '../data/queries'
import { HomeView } from '../views/HomeView'

export type HomePageData = {
  siteName: string
  siteDescription?: string
  posts: PostListItem[]
}

export async function loadHomePageData(): Promise<HomePageData> {
  const [settings, posts] = await Promise.all([getCachedSiteSettings()(), queryPosts()])

  return {
    siteName: settings.siteName || 'Crispy',
    siteDescription: settings.siteDescription || undefined,
    posts,
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
