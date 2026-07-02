import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Category, Tag } from '@/payload-types'

import { getCachedFriendLinks } from '@/utilities/getFriendLinks'

export type BlogPostCard = {
  title: string
  url: string
  excerpt?: string
  pubDate: string
  categories: string[]
  tags: string[]
}

export type BlogSidebarCategory = {
  id: string
  title: string
  url: string
  count: number
}

export type BlogSidebarTag = {
  id: string
  title: string
  url: string
  count: number
}

export type BlogNavItem = {
  title: string
  url: string
  target?: string | null
}

export type BlogSidebarAuthor = {
  title: string
  excerpt?: string
  url: string
}

const POST_CARD_SELECT = {
  title: true,
  slug: true,
  meta: true,
  publishedAt: true,
  categories: true,
  tags: true,
} as const

function postArchiveUrl(slug: string): string {
  return `/archives/${slug}`
}

function formatPostCard(post: {
  slug?: string | null
  title: string
  meta?: { description?: string | null } | null
  publishedAt?: string | null
  categories?: (number | Category)[] | null
  tags?: (number | Tag)[] | null
}): BlogPostCard | null {
  if (!post.slug || !post.title || !post.publishedAt) return null

  const categories = (post.categories || [])
    .map((c) => (typeof c === 'object' && c?.title ? c.title : null))
    .filter(Boolean) as string[]

  const tags = (post.tags || [])
    .map((t) => (typeof t === 'object' && t?.title ? t.title : null))
    .filter(Boolean) as string[]

  return {
    title: post.title,
    url: postArchiveUrl(post.slug),
    excerpt: post.meta?.description || undefined,
    pubDate: post.publishedAt,
    categories,
    tags,
  }
}

export const queryBlogPosts = cache(async (limit = 1000): Promise<BlogPostCard[]> => {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'posts',
    depth: 1,
    limit,
    overrideAccess: false,
    pagination: false,
    select: POST_CARD_SELECT,
    sort: '-publishedAt',
    where: { _status: { equals: 'published' } },
  })

  return docs
    .map(formatPostCard)
    .filter((post): post is BlogPostCard => post !== null)
})

export const queryBlogPostBySlug = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    depth: 2,
    limit: 1,
    overrideAccess: false,
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
    },
  })

  return result.docs[0] ?? null
})

export const queryBlogPostsByCategorySlug = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })

  const categoryResult = await payload.find({
    collection: 'categories',
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: { slug: { equals: slug } },
  })

  const category = categoryResult.docs[0]
  if (!category) return { category: null, posts: [] as BlogPostCard[] }

  const { docs } = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: POST_CARD_SELECT,
    sort: '-publishedAt',
    where: {
      _status: { equals: 'published' },
      categories: { contains: category.id },
    },
  })

  return {
    category,
    posts: docs.map(formatPostCard).filter((p): p is BlogPostCard => p !== null),
  }
})

export const queryBlogPostsByTagSlug = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })

  const tagResult = await payload.find({
    collection: 'tags',
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: { slug: { equals: slug } },
  })

  const tag = tagResult.docs[0]
  if (!tag) return { tag: null, posts: [] as BlogPostCard[] }

  const { docs } = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: POST_CARD_SELECT,
    sort: '-publishedAt',
    where: {
      _status: { equals: 'published' },
      tags: { contains: tag.id },
    },
  })

  return {
    tag,
    posts: docs.map(formatPostCard).filter((p): p is BlogPostCard => p !== null),
  }
})

export const queryBlogSidebarData = cache(async () => {
  const payload = await getPayload({ config: configPromise })

  const [categoriesResult, tagsResult, postsResult, headerData] = await Promise.all([
    payload.find({
      collection: 'categories',
      depth: 0,
      limit: 100,
      overrideAccess: false,
      pagination: false,
      sort: 'title',
      select: { title: true, slug: true },
    }),
    payload.find({
      collection: 'tags',
      depth: 0,
      limit: 100,
      overrideAccess: false,
      pagination: false,
      sort: 'title',
      select: { title: true, slug: true },
    }),
    payload.find({
      collection: 'posts',
      depth: 1,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: { categories: true, tags: true },
      where: { _status: { equals: 'published' } },
    }),
    payload.findGlobal({ slug: 'header', depth: 1 }),
  ])

  const categoryCounts = new Map<string, number>()
  const tagCounts = new Map<string, number>()

  for (const post of postsResult.docs) {
    for (const cat of post.categories || []) {
      if (typeof cat === 'object' && cat?.id) {
        categoryCounts.set(String(cat.id), (categoryCounts.get(String(cat.id)) || 0) + 1)
      }
    }
    for (const tag of post.tags || []) {
      if (typeof tag === 'object' && tag?.id) {
        tagCounts.set(String(tag.id), (tagCounts.get(String(tag.id)) || 0) + 1)
      }
    }
  }

  const categories: BlogSidebarCategory[] = categoriesResult.docs
    .filter((c): c is Category & { slug: string } => Boolean(c.slug))
    .map((c) => ({
      id: String(c.id),
      title: c.title,
      url: `/categories/${c.slug}`,
      count: categoryCounts.get(String(c.id)) || 0,
    }))

  const tags: BlogSidebarTag[] = tagsResult.docs
    .filter((t): t is Tag & { slug: string } => Boolean(t.slug))
    .map((t) => ({
      id: String(t.id),
      title: t.title,
      url: `/tags/${t.slug}`,
      count: tagCounts.get(String(t.id)) || 0,
    }))

  const menu: BlogNavItem[] = (headerData?.navItems || [])
    .map((item) => ({
      title: item.link?.label || '',
      url: item.link?.url || '/',
      target: item.link?.newTab ? '_blank' : '_self',
    }))
    .filter((item) => item.title && item.url)

  const defaultAuthorPost = await payload.find({
    collection: 'posts',
    depth: 0,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    sort: '-publishedAt',
    select: { populatedAuthors: true },
    where: { _status: { equals: 'published' } },
  })

  const firstAuthor = defaultAuthorPost.docs[0]?.populatedAuthors?.[0]
  const author: BlogSidebarAuthor | undefined = firstAuthor?.name
    ? {
        title: firstAuthor.name,
        url: `/authors/${slugifyAuthorName(firstAuthor.name, firstAuthor.id || 'author')}`,
      }
    : undefined

  return { categories, tags, menu, author }
})

export const queryBlogArchiveGroups = cache(async () => {
  const posts = await queryBlogPosts()
  const byYearMonth = new Map<string, BlogPostCard[]>()

  for (const post of posts) {
    const d = new Date(post.pubDate)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!byYearMonth.has(key)) byYearMonth.set(key, [])
    byYearMonth.get(key)!.push(post)
  }

  return Array.from(byYearMonth.entries()).sort((a, b) => b[0].localeCompare(a[0]))
})

export const queryBlogPageBySlug = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    depth: 2,
    limit: 1,
    overrideAccess: false,
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
    },
  })

  return result.docs[0] ?? null
})

export const queryBlogAuthorBySlug = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'posts',
    depth: 0,
    limit: 200,
    overrideAccess: false,
    pagination: false,
    select: { populatedAuthors: true },
    where: { _status: { equals: 'published' } },
  })

  for (const post of docs) {
    for (const author of post.populatedAuthors || []) {
      if (author?.name && slugifyAuthorName(author.name, author.id || author.name) === slug) {
        return author
      }
    }
  }

  return null
})

export const queryBlogAuthorPage = cache(async (slug: string) => {
  const author = await queryBlogAuthorBySlug(slug)
  if (!author?.name) return null

  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { ...POST_CARD_SELECT, populatedAuthors: true },
    sort: '-publishedAt',
    where: { _status: { equals: 'published' } },
  })

  const posts = docs
    .filter((post) =>
      (post.populatedAuthors || []).some(
        (entry) =>
          entry?.name && slugifyAuthorName(entry.name, entry.id || entry.name) === slug,
      ),
    )
    .map(formatPostCard)
    .filter((post): post is BlogPostCard => post !== null)

  return { author, posts }
})

/** Friend links for blog pages. */
export const queryBlogFriendLinks = getCachedFriendLinks

function slugifyAuthorName(name: string | null | undefined, id: number | string): string {
  if (!name) return String(id)
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '')
  return slug || String(id)
}

export { postArchiveUrl, slugifyAuthorName }
