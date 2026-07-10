import type { Metadata } from 'next'

import { frontendLabels } from '@/i18n/frontend-labels'
import { getNovelsPath } from '@/utilities/frontendPaths'

import type { NovelListItem } from '../data/types'
import { queryPublishedNovels } from '../data/queries'
import { buildBlogListMetadata } from '../seo'
import { NovelsView } from '../views/NovelsView'

export type NovelsPageData = {
  novels: NovelListItem[]
}

export async function loadNovelsPageData(): Promise<NovelsPageData> {
  const novels = await queryPublishedNovels()
  return { novels }
}

export async function novelsPageMetadata(): Promise<Metadata> {
  return buildBlogListMetadata({
    title: frontendLabels.novels.title,
    description: frontendLabels.novels.description,
    path: getNovelsPath(),
  })
}

export const novelsPage = {
  load: loadNovelsPageData,
  View: NovelsView,
  metadata: novelsPageMetadata,
}
