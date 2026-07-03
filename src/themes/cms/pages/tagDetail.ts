import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import type { Tag } from '@/payload-types'
import type { SlugPageProps } from '@/themes/types'

import type { PostListItem } from '../data/types'
import { queryPostsByTagSlug } from '../data/queries'
import { TagDetailView } from '../views/TagDetailView'

export type TagDetailPageData = {
  tag: Tag
  posts: PostListItem[]
}

export async function loadTagDetailPageData({ params }: SlugPageProps): Promise<TagDetailPageData> {
  const { slug } = await params
  const { tag, posts } = await queryPostsByTagSlug(decodeURIComponent(slug))

  if (!tag) notFound()

  return { tag, posts }
}

export async function tagDetailPageMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params
  const { tag } = await queryPostsByTagSlug(decodeURIComponent(slug))
  if (!tag) return { title: '标签不存在' }
  return { title: `标签: ${tag.title}` }
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
