import { cache } from 'react'

import { getNovelPath, getNovelsPath } from '@/utilities/frontendPaths'

import { queryNovelChapters } from './queries'

export type { NovelSidebarData } from './novelRoutes'
export { isNovelFrontendPath, isNovelsListPath } from './novelRoutes'

export const queryNovelSidebarBySlug = cache(async (novelSlug: string) => {
  const { novel, chapters } = await queryNovelChapters(novelSlug)
  if (!novel?.slug) return null

  return {
    novelTitle: novel.title,
    novelUrl: getNovelPath(novel.slug),
    novelsUrl: getNovelsPath(),
    chapters,
  }
})
