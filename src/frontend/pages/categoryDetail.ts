import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import type { Category } from '@/payload-types'
import type { SlugPageProps } from '@/frontend/types'
import { getCategoryPath } from '@/utilities/frontendPaths'

import type { PostListItem } from '../data/types'
import { queryPostsByCategorySlugPaginated } from '../data/queries'
import {
  BLOG_LIST_PAGE_SIZE,
  buildPaginationMeta,
  parsePageParam,
} from '../pagination'
import type { PaginationMeta } from '../pagination'
import { buildBlogListMetadata } from '../seo'
import { CategoryDetailView } from '../views/CategoryDetailView'

export type CategoryDetailPageData = {
  category: Category
  posts: PostListItem[]
  pagination: PaginationMeta
}

export async function loadCategoryDetailPageData({
  params,
  searchParams,
}: SlugPageProps): Promise<CategoryDetailPageData> {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const page = parsePageParam(searchParams ? await searchParams : undefined)
  const result = await queryPostsByCategorySlugPaginated(
    decodedSlug,
    page,
    BLOG_LIST_PAGE_SIZE,
  )

  if (!result.category) notFound()

  return {
    category: result.category,
    posts: result.posts,
    pagination: buildPaginationMeta(result.page, result.pageSize, result.totalDocs),
  }
}

export async function categoryDetailPageMetadata({
  params,
  searchParams,
}: SlugPageProps): Promise<Metadata> {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const page = parsePageParam(searchParams ? await searchParams : undefined)
  const { category } = await queryPostsByCategorySlugPaginated(decodedSlug, 1, 1)
  if (!category) return { title: '分类不存在' }

  return buildBlogListMetadata({
    title: `分类: ${category.title}`,
    description: `查看分类「${category.title}」下的全部文章`,
    path: getCategoryPath(decodedSlug),
    page,
  })
}

export async function categoryDetailStaticParams() {
  const configPromise = (await import('@payload-config')).default
  const { getPayload } = await import('payload')
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'categories',
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return categories.docs.map(({ slug }) => ({ slug: slug || '' }))
}

export const categoryDetailPage = {
  params: 'slug' as const,
  load: loadCategoryDetailPageData,
  View: CategoryDetailView,
  metadata: categoryDetailPageMetadata,
  staticParams: categoryDetailStaticParams,
}
