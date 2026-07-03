import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import type { Category } from '@/payload-types'
import type { SlugPageProps } from '@/themes/types'

import type { PostListItem } from '../data/types'
import { queryPostsByCategorySlug } from '../data/queries'
import { CategoryDetailView } from '../views/CategoryDetailView'

export type CategoryDetailPageData = {
  category: Category
  posts: PostListItem[]
}

export async function loadCategoryDetailPageData({
  params,
}: SlugPageProps): Promise<CategoryDetailPageData> {
  const { slug } = await params
  const { category, posts } = await queryPostsByCategorySlug(decodeURIComponent(slug))

  if (!category) notFound()

  return { category, posts }
}

export async function categoryDetailPageMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params
  const { category } = await queryPostsByCategorySlug(decodeURIComponent(slug))
  if (!category) return { title: '分类不存在' }
  return { title: `分类: ${category.title}` }
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
