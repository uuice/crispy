import type { Metadata } from 'next'

import { getCachedSiteSettings } from '@/utilities/getSiteSettings'

import type { PostListItem } from '../data/types'
import { queryPosts, queryPublishedPostsCount } from '../data/queries'
import { BLOG_HOME_POST_LIMIT } from '../pagination'
import { buildBlogListMetadata } from '../seo'
import { HomeView } from '../views/HomeView'

export type HomePageData = {
  siteName: string
  siteDescription?: string
  posts: PostListItem[]
  totalPosts: number
}

export async function loadHomePageData(): Promise<HomePageData> {
  const [settings, posts, totalPosts] = await Promise.all([
    getCachedSiteSettings()(),
    queryPosts(BLOG_HOME_POST_LIMIT),
    queryPublishedPostsCount(),
  ])

  return {
    siteName: settings.siteName || '博客',
    siteDescription: settings.siteDescription || undefined,
    posts,
    totalPosts,
  }
}

export async function homePageMetadata(): Promise<Metadata> {
  const settings = await getCachedSiteSettings()()
  return buildBlogListMetadata({
    title: settings.siteName || '博客',
    description: settings.siteDescription || undefined,
    path: '/',
  })
}

export const homePage = {
  load: loadHomePageData,
  View: HomeView,
  metadata: homePageMetadata,
}
