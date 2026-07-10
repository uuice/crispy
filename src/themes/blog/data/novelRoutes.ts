import { getNovelsPath } from '@/utilities/frontendPaths'

import type { NovelChapterItem } from './types'

export type NovelSidebarData = {
  novelTitle: string
  novelUrl: string
  novelsUrl: string
  chapters: NovelChapterItem[]
  currentChapterSlug?: string
}

export function isNovelsListPath(pathname: string): boolean {
  const novelsPath = getNovelsPath()
  return pathname === novelsPath || pathname === `${novelsPath}/`
}

export function isNovelFrontendPath(pathname: string): boolean {
  const novelsPath = getNovelsPath()

  return (
    pathname === novelsPath ||
    pathname === `${novelsPath}/` ||
    pathname.startsWith(`${novelsPath}/`)
  )
}
