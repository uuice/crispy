import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import type { Tag } from '@/payload-types'
import type { SlugPageProps } from '@/themes/types'
import { getTagPath } from '@/utilities/frontendPaths'

import type { PostListItem } from '../data/types'
import { queryPostsByTagSlugPaginated } from '../data/queries'
import {
  BLOG_LIST_PAGE_SIZE,
  buildPaginationMeta,
  parsePageParam,
} from '../pagination'
import type { PaginationMeta } from '../pagination'
import { buildBlogListMetadata } from '../seo'
import { TagDetailView } from '../views/TagDetailView'

export type TagDetailPageData = {
  tag: Tag
  posts: PostListItem[]
  pagination: PaginationMeta
}

export async function loadTagDetailPageData({
  params,
  searchParams,
}: SlugPageProps): Promise<TagDetailPageData> {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const page = parsePageParam(searchParams ? await searchParams : undefined)
  const result = await queryPostsByTagSlugPaginated(decodedSlug, page, BLOG_LIST_PAGE_SIZE)

  if (!result.tag) notFound()

  return {
    tag: result.tag,
    posts: result.posts,
    pagination: buildPaginationMeta(result.page, result.pageSize, result.totalDocs),
  }
}

export async function tagDetailPageMetadata({
  params,
  searchParams,
}: SlugPageProps): Promise<Metadata> {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const page = parsePageParam(searchParams ? await searchParams : undefined)
  const { tag } = await queryPostsByTagSlugPaginated(decodedSlug, 1, 1)
  if (!tag) return { title: '标签不存在' }

  return buildBlogListMetadata({
    title: `标签: ${tag.title}`,
    description: `查看标签「${tag.title}」下的全部文章`,
    path: getTagPath(decodedSlug),
    page,
  })
}

export async function tagDetailStaticParams() {
  const configPromise = (await import('@payload-config')).default
  const { getPayload } = await import('payload')
  const payload = await getPayload({ config: configPromise })

  const tags = await payload.find({
    collection: 'tags',
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return tags.docs.map(({ slug }) => ({ slug: slug || '' }))
}

export const tagDetailPage = {
  params: 'slug' as const,
  load: loadTagDetailPageData,
  View: TagDetailView,
  metadata: tagDetailPageMetadata,
  staticParams: tagDetailStaticParams,
}
