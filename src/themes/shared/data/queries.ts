import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Category, GalleryItem, Tag } from '@/payload-types'

import { getCachedFriendLinks } from '@/utilities/getFriendLinks'
import {
  getCategoryPath,
  getPostPath,
  getTagPath,
  getUserPath,
  slugifyUserName,
} from '@/utilities/frontendPaths'

import type { NavItem, PostListItem, SidebarCategory, SidebarTag, SidebarUser } from './types'

export type {
  NavItem,
  PostListItem,
  SidebarCategory,
  SidebarData,
  SidebarTag,
  SidebarUser,
} from './types'

const POST_CARD_SELECT = {
  title: true,
  slug: true,
  meta: true,
  publishedAt: true,
  categories: true,
  tags: true,
} as const

function formatPostListItem(post: {
  slug?: string | null
  title: string
  meta?: { description?: string | null } | null
  publishedAt?: string | null
  categories?: (number | Category)[] | null
  tags?: (number | Tag)[] | null
}): PostListItem | null {
  if (!post.slug || !post.title || !post.publishedAt) return null

  const categories = (post.categories || [])
    .map((c) => (typeof c === 'object' && c?.title ? c.title : null))
    .filter(Boolean) as string[]

  const tags = (post.tags || [])
    .map((t) => (typeof t === 'object' && t?.title ? t.title : null))
    .filter(Boolean) as string[]

  return {
    title: post.title,
    url: getPostPath(post.slug),
    excerpt: post.meta?.description || undefined,
    pubDate: post.publishedAt,
    categories,
    tags,
  }
}

export const queryPosts = cache(async (limit = 1000): Promise<PostListItem[]> => {
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
    .map(formatPostListItem)
    .filter((post): post is PostListItem => post !== null)
})

export const queryPostBySlug = cache(async (slug: string) => {
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

export const queryPostsByCategorySlug = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })

  const categoryResult = await payload.find({
    collection: 'categories',
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: { slug: { equals: slug } },
  })

  const category = categoryResult.docs[0]
  if (!category) return { category: null, posts: [] as PostListItem[] }

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
    posts: docs.map(formatPostListItem).filter((p): p is PostListItem => p !== null),
  }
})

export const queryPostsByTagSlug = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })

  const tagResult = await payload.find({
    collection: 'tags',
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: { slug: { equals: slug } },
  })

  const tag = tagResult.docs[0]
  if (!tag) return { tag: null, posts: [] as PostListItem[] }

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
    posts: docs.map(formatPostListItem).filter((p): p is PostListItem => p !== null),
  }
})

export const querySidebarData = cache(async () => {
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

  const categories: SidebarCategory[] = categoriesResult.docs
    .filter((c): c is Category & { slug: string } => Boolean(c.slug))
    .map((c) => ({
      id: String(c.id),
      title: c.title,
      url: getCategoryPath(c.slug),
      count: categoryCounts.get(String(c.id)) || 0,
    }))

  const tags: SidebarTag[] = tagsResult.docs
    .filter((t): t is Tag & { slug: string } => Boolean(t.slug))
    .map((t) => ({
      id: String(t.id),
      title: t.title,
      url: getTagPath(t.slug),
      count: tagCounts.get(String(t.id)) || 0,
    }))

  const menu: NavItem[] = (headerData?.navItems || [])
    .map((item) => ({
      title: item.link?.label || '',
      url: item.link?.url || '/',
      target: item.link?.newTab ? '_blank' : '_self',
    }))
    .filter((item) => item.title && item.url)

  const defaultUserPost = await payload.find({
    collection: 'posts',
    depth: 0,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    sort: '-publishedAt',
    select: { populatedAuthors: true },
    where: { _status: { equals: 'published' } },
  })

  const firstUser = defaultUserPost.docs[0]?.populatedAuthors?.[0]
  const user: SidebarUser | undefined = firstUser?.name
    ? {
        title: firstUser.name,
        url: getUserPath(slugifyUserName(firstUser.name, firstUser.id || 'user')),
      }
    : undefined

  return { categories, tags, menu, user }
})

export const queryPostArchiveGroups = cache(async () => {
  const posts = await queryPosts()
  const byYearMonth = new Map<string, PostListItem[]>()

  for (const post of posts) {
    const d = new Date(post.pubDate)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!byYearMonth.has(key)) byYearMonth.set(key, [])
    byYearMonth.get(key)!.push(post)
  }

  return Array.from(byYearMonth.entries()).sort((a, b) => b[0].localeCompare(a[0]))
})

export const queryPageBySlug = cache(async (slug: string) => {
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

export const queryUserBySlug = cache(async (slug: string) => {
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
    for (const user of post.populatedAuthors || []) {
      if (user?.name && slugifyUserName(user.name, user.id || user.name) === slug) {
        return user
      }
    }
  }

  return null
})

export const queryUserPage = cache(async (slug: string) => {
  const user = await queryUserBySlug(slug)
  if (!user?.name) return null

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
        (entry) => entry?.name && slugifyUserName(entry.name, entry.id || entry.name) === slug,
      ),
    )
    .map(formatPostListItem)
    .filter((post): post is PostListItem => post !== null)

  return { user, posts }
})

export const queryFriendLinks = getCachedFriendLinks

export const queryJobs = cache(async () => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'jobs',
    depth: 0,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    sort: '-publishedAt',
    where: { enabled: { equals: true } },
    select: {
      title: true,
      slug: true,
      department: true,
      location: true,
      employmentType: true,
      salary: true,
      publishedAt: true,
    },
  })

  return result.docs
})

export const queryGalleryItems = cache(async (): Promise<GalleryItem[]> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'gallery-items',
    depth: 1,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    sort: 'sort',
    where: { enabled: { equals: true } },
  })

  return result.docs
})