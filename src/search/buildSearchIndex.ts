import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { SearchIndexItem } from '@/frontend/types'
import {
  getGalleryPath,
  getPagePath,
  getPostPath,
} from '@/utilities/frontendPaths'
import { publishedBlogPostsWhere } from '@/utilities/publishedContentWhere'

export async function buildSearchIndex(): Promise<SearchIndexItem[]> {
  const payload = await getPayload({ config: configPromise })

  const [postsResult, pagesResult, galleryResult] = await Promise.all([
    payload.find({
      collection: 'posts',
      depth: 1,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        title: true,
        slug: true,
        meta: true,
        categories: true,
        tags: true,
      },
      sort: '-publishedAt',
      where: publishedBlogPostsWhere,
    }),
    payload.find({
      collection: 'pages',
      depth: 0,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        title: true,
        slug: true,
        meta: true,
      },
      sort: '-updatedAt',
      where: { _status: { equals: 'published' } },
    }),
    payload.find({
      collection: 'galleries',
      depth: 0,
      limit: 200,
      overrideAccess: false,
      pagination: false,
      select: {
        title: true,
        slug: true,
        description: true,
      },
      sort: 'sort',
      where: { enabled: { equals: true } },
    }),
  ])

  const items: SearchIndexItem[] = []

  for (const post of postsResult.docs) {
    if (!post.slug || !post.title) continue

    const categories = (post.categories || [])
      .map((entry) => (typeof entry === 'object' && entry?.title ? entry.title : null))
      .filter(Boolean) as string[]

    const tags = (post.tags || [])
      .map((entry) => (typeof entry === 'object' && entry?.title ? entry.title : null))
      .filter(Boolean) as string[]

    const excerpt = post.meta?.description || ''

    items.push({
      id: `post:${post.slug}`,
      title: post.title,
      url: getPostPath(post.slug),
      excerpt: excerpt.slice(0, 200),
      categories,
      tags,
      body: excerpt.slice(0, 8000),
    })
  }

  for (const page of pagesResult.docs) {
    if (!page.slug || !page.title || page.slug === 'home') continue

    const excerpt = page.meta?.description || ''

    items.push({
      id: `page:${page.slug}`,
      title: page.title,
      url: getPagePath(page.slug),
      excerpt: excerpt.slice(0, 200),
      body: excerpt.slice(0, 8000),
    })
  }

  for (const item of galleryResult.docs) {
    if (!item.title || !item.slug) continue

    const excerpt = item.description || ''

    items.push({
      id: `gallery:${item.slug}`,
      title: item.title,
      url: getGalleryPath(item.slug),
      excerpt: excerpt.slice(0, 200),
      body: excerpt.slice(0, 8000),
    })
  }

  return items
}
