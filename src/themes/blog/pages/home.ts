import type { Metadata } from 'next'

import { getCachedSiteSettings } from '@/utilities/getSiteSettings'

import type { PostListItem, LatestNovelChapterItem } from '../data/types'
import { queryLatestNovelChapters, queryPosts, queryPublishedPostsCount } from '../data/queries'
import { BLOG_HOME_NOVEL_UPDATE_LIMIT, BLOG_HOME_POST_LIMIT } from '../pagination'
import { buildBlogListMetadata } from '../seo'
import { HomeView } from '../views/HomeView'

export type HomePageData = {
  siteName: string
  siteDescription?: string
  posts: PostListItem[]
  totalPosts: number
  latestNovelChapters: LatestNovelChapterItem[]
}

export async function loadHomePageData(): Promise<HomePageData> {
  const settings = await getCachedSiteSettings()()
  const showNovelUpdates = settings.showNovelUpdatesOnHome === true

  const [posts, totalPosts, latestNovelChapters] = await Promise.all([
    queryPosts(BLOG_HOME_POST_LIMIT),
    queryPublishedPostsCount(),
    showNovelUpdates
      ? queryLatestNovelChapters(BLOG_HOME_NOVEL_UPDATE_LIMIT)
      : Promise.resolve([]),
  ])

  return {
    siteName: settings.siteName || '博客',
    siteDescription: settings.siteDescription || undefined,
    posts,
    totalPosts,
    latestNovelChapters,
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
