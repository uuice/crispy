import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { frontendLabels } from '@/i18n/frontend-labels'
import type { Novel } from '@/payload-types'
import type { SlugPageProps } from '@/frontend/types'
import { getNovelPath } from '@/utilities/frontendPaths'

import type { NovelChapterItem } from '../data/types'
import { queryNovelChapters } from '../data/queries'
import { buildBlogListMetadata } from '../seo'
import { NovelDetailView } from '../views/NovelDetailView'

export type NovelDetailPageData = {
  novel: Novel
  chapters: NovelChapterItem[]
}

export async function loadNovelDetailPageData({
  params,
}: SlugPageProps): Promise<NovelDetailPageData> {
  const { slug } = await params
  const { novel, chapters } = await queryNovelChapters(decodeURIComponent(slug))

  if (!novel) notFound()

  return { novel, chapters }
}

export async function novelDetailPageMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const { novel } = await queryNovelChapters(decodedSlug)
  if (!novel) return { title: frontendLabels.novels.notFound }

  return buildBlogListMetadata({
    title: novel.title,
    description: novel.synopsis || frontendLabels.novels.chapterList,
    path: getNovelPath(decodedSlug),
  })
}

export async function novelDetailStaticParams() {
  const configPromise = (await import('@payload-config')).default
  const { getPayload } = await import('payload')
  const payload = await getPayload({ config: configPromise })

  const novels = await payload.find({
    collection: 'novels',
    limit: 100,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
    where: { enabled: { equals: true } },
  })

  return novels.docs.map(({ slug }) => ({ slug: slug || '' }))
}

export const novelDetailPage = {
  params: 'slug' as const,
  load: loadNovelDetailPageData,
  View: NovelDetailView,
  metadata: novelDetailPageMetadata,
  staticParams: novelDetailStaticParams,
}
