import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { frontendLabels } from '@/i18n/frontend-labels'
import type { NovelChapter } from '@/payload-types'
import type { NovelChapterPageProps } from '@/themes/types'
import { getNovelChapterPath } from '@/utilities/frontendPaths'
import { publishedNovelChaptersWhere } from '@/utilities/publishedContentWhere'

import type { NovelChapterItem } from '../data/types'
import { queryNovelChapter } from '../data/queries'
import { buildBlogPostMetadata } from '../seo'
import { NovelChapterView } from '../views/NovelChapterView'

export type NovelChapterPageData = {
  novelTitle: string
  novelUrl: string
  novelsUrl: string
  chapter: NovelChapter
  chapters: NovelChapterItem[]
  chapterIndex: number
  prev: NovelChapterItem | null
  next: NovelChapterItem | null
  dateStr: string
}

export async function loadNovelChapterPageData({
  params,
}: NovelChapterPageProps): Promise<NovelChapterPageData> {
  const { slug, chapterSlug } = await params
  const novelSlug = decodeURIComponent(slug)
  const decodedChapterSlug = decodeURIComponent(chapterSlug)
  const result = await queryNovelChapter(novelSlug, decodedChapterSlug)

  if (!result) notFound()

  const dateStr = result.chapter.publishedAt
    ? new Date(result.chapter.publishedAt).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : ''

  return {
    novelTitle: result.novel.title,
    novelUrl: result.novelUrl,
    novelsUrl: result.novelsUrl,
    chapter: result.chapter,
    chapters: result.chapters,
    chapterIndex: result.chapterIndex,
    prev: result.prev,
    next: result.next,
    dateStr,
  }
}

export async function novelChapterPageMetadata({
  params,
}: NovelChapterPageProps): Promise<Metadata> {
  const { slug, chapterSlug } = await params
  const result = await queryNovelChapter(decodeURIComponent(slug), decodeURIComponent(chapterSlug))
  if (!result) return { title: frontendLabels.novels.chapterNotFound }

  const meta = await buildBlogPostMetadata(result.chapter)
  return {
    ...meta,
    title: `${result.chapter.title} | ${result.novel.title}`,
    alternates: {
      canonical: getNovelChapterPath(result.novel.slug!, result.chapter.slug!),
    },
  }
}

export async function novelChapterStaticParams() {
  const configPromise = (await import('@payload-config')).default
  const { getPayload } = await import('payload')
  const payload = await getPayload({ config: configPromise })

  const chapters = await payload.find({
    collection: 'novel-chapters',
    depth: 0,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true, novel: true },
    where: publishedNovelChaptersWhere,
  })

  const novels = await payload.find({
    collection: 'novels',
    depth: 0,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    select: { id: true, slug: true },
    where: { enabled: { equals: true } },
  })

  const novelSlugById = new Map(
    novels.docs.filter((novel) => novel.slug).map((novel) => [novel.id, novel.slug!]),
  )

  return chapters.docs.flatMap((chapter) => {
    const novelId = typeof chapter.novel === 'object' ? chapter.novel?.id : chapter.novel
    const novelSlug = novelId != null ? novelSlugById.get(novelId) : undefined
    if (!novelSlug || !chapter.slug) return []
    return [{ slug: novelSlug, chapterSlug: chapter.slug }]
  })
}

export const novelChapterPage = {
  params: 'novelChapter' as const,
  load: loadNovelChapterPageData,
  View: NovelChapterView,
  metadata: novelChapterPageMetadata,
  staticParams: novelChapterStaticParams,
}
