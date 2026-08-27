import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import type { NovelTag } from '@/payload-types'
import type { SlugPageProps } from '@/frontend/types'
import { getNovelTagPath } from '@/utilities/frontendPaths'
import { queryNovelsByNovelTagSlugPaginated } from '@/frontend/data/queries'

import {
  BLOG_LIST_PAGE_SIZE,
  buildPaginationMeta,
  parsePageParam,
} from '../pagination'
import type { PaginationMeta } from '../pagination'
import type { NovelListItem } from '../data/types'
import { buildBlogListMetadata } from '../seo'
import { NovelTagDetailView } from '../views/NovelTagDetailView'

export type NovelTagDetailPageData = {
  tag: NovelTag
  novels: NovelListItem[]
  pagination: PaginationMeta
}

export async function loadNovelTagDetailPageData({
  params,
  searchParams,
}: SlugPageProps): Promise<NovelTagDetailPageData> {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const page = parsePageParam(searchParams ? await searchParams : undefined)
  const result = await queryNovelsByNovelTagSlugPaginated(decodedSlug, page, BLOG_LIST_PAGE_SIZE)

  if (!result.tag) notFound()

  return {
    tag: result.tag,
    novels: result.novels,
    pagination: buildPaginationMeta(result.page, result.pageSize, result.totalDocs),
  }
}

export async function novelTagDetailPageMetadata({
  params,
  searchParams,
}: SlugPageProps): Promise<Metadata> {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const page = parsePageParam(searchParams ? await searchParams : undefined)
  const { tag } = await queryNovelsByNovelTagSlugPaginated(decodedSlug, 1, 1)
  if (!tag) return { title: '小说标签不存在' }

  return buildBlogListMetadata({
    title: `小说标签: ${tag.title}`,
    description: tag.description || `查看小说标签「${tag.title}」下的全部作品`,
    path: getNovelTagPath(decodedSlug),
    page,
  })
}

export async function novelTagDetailStaticParams() {
  const configPromise = (await import('@payload-config')).default
  const { getPayload } = await import('payload')
  const payload = await getPayload({ config: configPromise })

  const tags = await payload.find({
    collection: 'novel-tags',
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return tags.docs.map(({ slug }) => ({ slug: slug || '' }))
}

export const novelTagDetailPage = {
  params: 'slug' as const,
  load: loadNovelTagDetailPageData,
  View: NovelTagDetailView,
  metadata: novelTagDetailPageMetadata,
  staticParams: novelTagDetailStaticParams,
}
