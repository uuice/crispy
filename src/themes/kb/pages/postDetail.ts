import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import type { Post } from '@/payload-types'
import type { SlugPageProps } from '@/themes/types'
import { getPostPath } from '@/utilities/frontendPaths'

import { queryPostBySlug } from '../data/queries'
import { PostDetailView } from '../views/PostDetailView'

export type PostDetailPageData = {
  post: Post
  decodedSlug: string
  dateStr: string
  categories: string[]
  tags: string[]
  articleUrl: string
}

export async function loadPostDetailPageData({ params }: SlugPageProps): Promise<PostDetailPageData> {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug(decodedSlug)

  if (!post) notFound()

  const dateStr = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : ''

  const categories = (post.categories || [])
    .map((c) => (typeof c === 'object' && c?.title ? c.title : null))
    .filter(Boolean) as string[]

  const tags = (post.tags || [])
    .map((t) => (typeof t === 'object' && t?.title ? t.title : null))
    .filter(Boolean) as string[]

  return {
    post,
    decodedSlug,
    dateStr,
    categories,
    tags,
    articleUrl: getPostPath(decodedSlug),
  }
}

export async function postDetailPageMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await queryPostBySlug(decodeURIComponent(slug))
  if (!post) return { title: '文章不存在' }
  return {
    title: post.title,
    description: post.meta?.description || undefined,
  }
}

export async function postDetailStaticParams() {
  const configPromise = (await import('@payload-config')).default
  const { getPayload } = await import('payload')
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return posts.docs.map(({ slug }) => ({ slug: slug || '' }))
}

export const postDetailPage = {
  params: 'slug' as const,
  load: loadPostDetailPageData,
  View: PostDetailView,
  metadata: postDetailPageMetadata,
  staticParams: postDetailStaticParams,
}
