import configPromise from '@payload-config'
import type { Where } from 'payload'
import { getPayload } from 'payload'
import { cache } from 'react'

import type {
  Category,
  Gallery,
  GalleryItem,
  Media,
  Tag,
} from '@/payload-types'

import { getCachedFriendLinkSections, getCachedFriendLinks } from '@/utilities/getFriendLinks'
import {
  getCategoryPath,
  getPostPath,
  getTagPath,
  getUserPath,
  slugifyUserName,
} from '@/utilities/frontendPaths'
import { mapGlobalNavItems } from '@/utilities/mapGlobalNavItems'
import {
  publishedBlogPostsWhere,
  withPublishedBlogPostsWhere,
} from '@/utilities/publishedContentWhere'

import type {
  NavItem,
  PaginatedPostList,
  PostListItem,
  SidebarAuthor,
  SidebarCategory,
  SidebarTag,
} from './types'

export type {
  NavItem,
  PaginatedPostList,
  PostListItem,
  SidebarAuthor,
  SidebarCategory,
  SidebarData,
  SidebarTag,
} from './types'

const POST_CARD_SELECT = {
  title: true,
  slug: true,
  meta: true,
  publishedAt: true,
  categories: true,
  tags: true,
} as const

function blogStreamPostWhere(extra?: Where): Where {
  return withPublishedBlogPostsWhere(extra)
}

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
    where: publishedBlogPostsWhere,
  })

  return docs
    .map(formatPostListItem)
    .filter((post): post is PostListItem => post !== null)
})

export const queryPublishedPostsCount = cache(async (): Promise<number> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.count({
    collection: 'posts',
    overrideAccess: false,
    where: publishedBlogPostsWhere,
  })

  return result.totalDocs
})

export const queryPostsPaginated = cache(
  async (page = 1, pageSize = 12): Promise<PaginatedPostList> => {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'posts',
      depth: 1,
      limit: pageSize,
      page,
      overrideAccess: false,
      pagination: true,
      select: POST_CARD_SELECT,
      sort: '-publishedAt',
      where: publishedBlogPostsWhere,
    })

    return {
      posts: result.docs
        .map(formatPostListItem)
        .filter((post): post is PostListItem => post !== null),
      page: result.page ?? page,
      pageSize,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
    }
  },
)

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
    where: blogStreamPostWhere({ categories: { contains: category.id } }),
  })

  return {
    category,
    posts: docs.map(formatPostListItem).filter((p): p is PostListItem => p !== null),
  }
})

export const queryPostsByCategorySlugPaginated = cache(
  async (slug: string, page = 1, pageSize = 12) => {
    const payload = await getPayload({ config: configPromise })

    const categoryResult = await payload.find({
      collection: 'categories',
      limit: 1,
      overrideAccess: false,
      pagination: false,
      where: { slug: { equals: slug } },
    })

    const category = categoryResult.docs[0]
    if (!category) {
      return { category: null, posts: [] as PostListItem[], page: 1, pageSize, totalDocs: 0, totalPages: 1 }
    }

    const result = await payload.find({
      collection: 'posts',
      depth: 1,
      limit: pageSize,
      page,
      overrideAccess: false,
      pagination: true,
      select: POST_CARD_SELECT,
      sort: '-publishedAt',
      where: blogStreamPostWhere({ categories: { contains: category.id } }),
    })

    return {
      category,
      posts: result.docs
        .map(formatPostListItem)
        .filter((p): p is PostListItem => p !== null),
      page: result.page ?? page,
      pageSize,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
    }
  },
)

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
    where: blogStreamPostWhere({ tags: { contains: tag.id } }),
  })

  return {
    tag,
    posts: docs.map(formatPostListItem).filter((p): p is PostListItem => p !== null),
  }
})

export const queryPostsByTagSlugPaginated = cache(async (slug: string, page = 1, pageSize = 12) => {
  const payload = await getPayload({ config: configPromise })

  const tagResult = await payload.find({
    collection: 'tags',
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: { slug: { equals: slug } },
  })

  const tag = tagResult.docs[0]
  if (!tag) {
    return { tag: null, posts: [] as PostListItem[], page: 1, pageSize, totalDocs: 0, totalPages: 1 }
  }

  const result = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: pageSize,
    page,
    overrideAccess: false,
    pagination: true,
    select: POST_CARD_SELECT,
    sort: '-publishedAt',
    where: blogStreamPostWhere({ tags: { contains: tag.id } }),
  })

  return {
    tag,
    posts: result.docs.map(formatPostListItem).filter((p): p is PostListItem => p !== null),
    page: result.page ?? page,
    pageSize,
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
  }
})

export const querySidebarData = cache(async () => {
  const payload = await getPayload({ config: configPromise })

  const [categoriesResult, tagsResult, postsResult, headerData, footerData] = await Promise.all([
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
      select: { categories: true, tags: true, authors: true, populatedAuthors: true },
      where: publishedBlogPostsWhere,
    }),
    payload.findGlobal({ slug: 'header', depth: 1 }),
    payload.findGlobal({ slug: 'footer', depth: 1 }),
  ])

  const categoryCounts = new Map<string, number>()
  const tagCounts = new Map<string, number>()
  const authorCounts = new Map<string, { id: string; name: string; count: number }>()

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
    for (const author of post.populatedAuthors || []) {
      if (!author?.id || !author?.name) continue
      const key = String(author.id)
      const existing = authorCounts.get(key)
      if (existing) {
        existing.count += 1
      } else {
        authorCounts.set(key, { id: key, name: author.name, count: 1 })
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
    .filter((c) => c.count > 0)

  const tags: SidebarTag[] = tagsResult.docs
    .filter((t): t is Tag & { slug: string } => Boolean(t.slug))
    .map((t) => ({
      id: String(t.id),
      title: t.title,
      url: getTagPath(t.slug),
      count: tagCounts.get(String(t.id)) || 0,
    }))
    .filter((t) => t.count > 0)

  const authors: SidebarAuthor[] = Array.from(authorCounts.values())
    .map((author) => ({
      id: author.id,
      title: author.name,
      url: getUserPath(slugifyUserName(author.name, author.id)),
      count: author.count,
    }))
    .filter((author) => author.count > 0)
    .sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))

  const menu = mapGlobalNavItems(headerData?.navItems)
  const footerMenu = mapGlobalNavItems(footerData?.navItems)

  return { categories, tags, authors, menu, footerMenu }
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
    select: { authors: true, populatedAuthors: true },
    where: { _status: { equals: 'published' } },
  })

  let matchedId: string | number | null = null

  for (const post of docs) {
    for (const user of post.populatedAuthors || []) {
      if (user?.name && slugifyUserName(user.name, user.id || user.name) === slug) {
        matchedId = user.id ?? null
        break
      }
    }
    if (matchedId) break
  }

  if (!matchedId) return null

  const profile = await payload.findByID({
    collection: 'users',
    id: matchedId,
    depth: 0,
    overrideAccess: true,
    select: {
      name: true,
      bio: true,
      bioDetail: true,
    },
  })

  return profile?.name ? profile : null
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
    select: { ...POST_CARD_SELECT, authors: true, populatedAuthors: true },
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

export const queryUserPagePaginated = cache(async (slug: string, page = 1, pageSize = 12) => {
  const user = await queryUserBySlug(slug)
  if (!user?.id || !user.name) return null

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: pageSize,
    page,
    overrideAccess: false,
    pagination: true,
    select: POST_CARD_SELECT,
    sort: '-publishedAt',
    where: {
      and: [{ _status: { equals: 'published' } }, { authors: { contains: user.id } }],
    },
  })

  return {
    user,
    posts: result.docs.map(formatPostListItem).filter((post): post is PostListItem => post !== null),
    page: result.page ?? page,
    pageSize,
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
  }
})

export const queryFriendLinks = getCachedFriendLinks
export const queryFriendLinkSections = getCachedFriendLinkSections

export type GalleryListItem = Gallery & {
  /** Explicit cover, or first enabled item image when cover is unset. */
  listCover: Media | null
}

function mediaFromUpload(value: Gallery['cover'] | GalleryItem['image']): Media | null {
  if (value && typeof value === 'object' && 'url' in value && value.url) {
    return value as Media
  }
  return null
}

export const queryGalleries = cache(async (): Promise<GalleryListItem[]> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'galleries',
    depth: 1,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    sort: 'sort',
    where: { enabled: { equals: true } },
  })

  const galleries = result.docs
  const missingCoverIds = galleries
    .filter((gallery) => !mediaFromUpload(gallery.cover))
    .map((gallery) => gallery.id)

  const firstImageByGallery = new Map<number | string, Media>()

  if (missingCoverIds.length > 0) {
    const items = await payload.find({
      collection: 'gallery-items',
      depth: 1,
      limit: Math.min(missingCoverIds.length * 5, 500),
      overrideAccess: false,
      pagination: false,
      sort: 'sort',
      where: {
        and: [
          { gallery: { in: missingCoverIds } },
          { enabled: { equals: true } },
        ],
      },
    })

    for (const item of items.docs) {
      const galleryId =
        typeof item.gallery === 'object' && item.gallery ? item.gallery.id : item.gallery
      if (galleryId == null || firstImageByGallery.has(galleryId)) continue
      const image = mediaFromUpload(item.image)
      if (image) firstImageByGallery.set(galleryId, image)
    }
  }

  return galleries.map((gallery) => ({
    ...gallery,
    listCover: mediaFromUpload(gallery.cover) ?? firstImageByGallery.get(gallery.id) ?? null,
  }))
})

export const queryGalleryBySlug = cache(
  async (
    slug: string,
  ): Promise<{ gallery: Gallery | null; items: GalleryItem[] }> => {
    const payload = await getPayload({ config: configPromise })

    const galleries = await payload.find({
      collection: 'galleries',
      depth: 1,
      limit: 1,
      overrideAccess: false,
      pagination: false,
      where: {
        and: [{ slug: { equals: slug } }, { enabled: { equals: true } }],
      },
    })

    const gallery = galleries.docs[0] ?? null
    if (!gallery) return { gallery: null, items: [] }

    const items = await payload.find({
      collection: 'gallery-items',
      depth: 1,
      limit: 500,
      overrideAccess: false,
      pagination: false,
      sort: 'sort',
      where: {
        and: [
          { gallery: { equals: gallery.id } },
          { enabled: { equals: true } },
        ],
      },
    })

    return { gallery, items: items.docs }
  },
)
