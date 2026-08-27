import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import type { Post } from '@/payload-types'
import type { SlugPageProps } from '@/frontend/types'
import { getPostPath } from '@/utilities/frontendPaths'
import { publishedBlogPostsWhere } from '@/utilities/publishedContentWhere'

import { queryPostBySlug } from '../data/queries'
import { buildBlogPostMetadata } from '../seo'
import { PostDetailView } from '../views/PostDetailView'

export type TaxonomyLink = {
  title: string
  slug: string
}

export type PostDetailPageData = {
  post: Post
  decodedSlug: string
  dateStr: string
  categories: TaxonomyLink[]
  tags: TaxonomyLink[]
  articleUrl: string
  authorName?: string
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
    .map((c) =>
      typeof c === 'object' && c?.title && c?.slug ? { title: c.title, slug: c.slug } : null,
    )
    .filter((item): item is TaxonomyLink => item !== null)

  const tags = (post.tags || [])
    .map((t) =>
      typeof t === 'object' && t?.title && t?.slug ? { title: t.title, slug: t.slug } : null,
    )
    .filter((item): item is TaxonomyLink => item !== null)

  const authorName = post.populatedAuthors?.[0]?.name || undefined

  return {
    post,
    decodedSlug,
    dateStr,
    categories,
    tags,
    articleUrl: getPostPath(decodedSlug),
    authorName,
  }
}

export async function postDetailPageMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await queryPostBySlug(decodeURIComponent(slug))
  if (!post) return { title: '文章不存在' }

  return buildBlogPostMetadata(post)
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
    where: publishedBlogPostsWhere,
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
