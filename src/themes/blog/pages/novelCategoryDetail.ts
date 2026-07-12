import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import type { NovelCategory } from '@/payload-types'
import type { SlugPageProps } from '@/themes/types'
import { getNovelCategoryPath } from '@/utilities/frontendPaths'
import { queryNovelsByNovelCategorySlugPaginated } from '@/themes/shared/data/queries'

import {
  BLOG_LIST_PAGE_SIZE,
  buildPaginationMeta,
  parsePageParam,
} from '../pagination'
import type { PaginationMeta } from '../pagination'
import type { NovelListItem } from '../data/types'
import { buildBlogListMetadata } from '../seo'
import { NovelCategoryDetailView } from '../views/NovelCategoryDetailView'

export type NovelCategoryDetailPageData = {
  category: NovelCategory
  novels: NovelListItem[]
  pagination: PaginationMeta
}

export async function loadNovelCategoryDetailPageData({
  params,
  searchParams,
}: SlugPageProps): Promise<NovelCategoryDetailPageData> {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const page = parsePageParam(searchParams ? await searchParams : undefined)
  const result = await queryNovelsByNovelCategorySlugPaginated(
    decodedSlug,
    page,
    BLOG_LIST_PAGE_SIZE,
  )

  if (!result.category) notFound()

  return {
    category: result.category,
    novels: result.novels,
    pagination: buildPaginationMeta(result.page, result.pageSize, result.totalDocs),
  }
}

export async function novelCategoryDetailPageMetadata({
  params,
  searchParams,
}: SlugPageProps): Promise<Metadata> {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const page = parsePageParam(searchParams ? await searchParams : undefined)
  const { category } = await queryNovelsByNovelCategorySlugPaginated(decodedSlug, 1, 1)
  if (!category) return { title: '小说分类不存在' }

  return buildBlogListMetadata({
    title: `小说分类: ${category.title}`,
    description: `查看小说分类「${category.title}」下的全部作品`,
    path: getNovelCategoryPath(decodedSlug),
    page,
  })
}

export async function novelCategoryDetailStaticParams() {
  const configPromise = (await import('@payload-config')).default
  const { getPayload } = await import('payload')
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'novel-categories',
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return categories.docs.map(({ slug }) => ({ slug: slug || '' }))
}

export const novelCategoryDetailPage = {
  params: 'slug' as const,
  load: loadNovelCategoryDetailPageData,
  View: NovelCategoryDetailView,
  metadata: novelCategoryDetailPageMetadata,
  staticParams: novelCategoryDetailStaticParams,
}
