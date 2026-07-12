import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { ThemeSearchIndexItem } from '@/themes/types'
import {
  getGalleryItemsPath,
  getJobsPath,
  getNovelChapterPath,
  getNovelPath,
  getPagePath,
  getPostPath,
} from '@/utilities/frontendPaths'
import {
  publishedBlogPostsWhere,
  publishedNovelChapterPostsWhere,
} from '@/utilities/publishedBlogPostsWhere'

export async function buildThemeSearchIndex(): Promise<ThemeSearchIndexItem[]> {
  const payload = await getPayload({ config: configPromise })

  const [postsResult, pagesResult, jobsResult, galleryResult, novelsResult, novelChaptersResult] =
    await Promise.all([
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
        collection: 'jobs',
        depth: 0,
        limit: 200,
        overrideAccess: false,
        pagination: false,
        select: {
          title: true,
          slug: true,
          location: true,
          department: true,
        },
        sort: '-publishedAt',
        where: { enabled: { equals: true } },
      }),
      payload.find({
        collection: 'gallery-items',
        depth: 0,
        limit: 200,
        overrideAccess: false,
        pagination: false,
        select: {
          title: true,
          description: true,
        },
        sort: 'sort',
        where: { enabled: { equals: true } },
      }),
      payload.find({
        collection: 'novels',
        depth: 0,
        limit: 500,
        overrideAccess: false,
        pagination: false,
        select: {
          title: true,
          slug: true,
          genre: true,
          synopsis: true,
          writingStyle: true,
          plotOutline: true,
        },
        where: { enabled: { equals: true } },
      }),
      payload.find({
        collection: 'posts',
        depth: 1,
        limit: 2000,
        overrideAccess: false,
        pagination: false,
        select: {
          title: true,
          slug: true,
          meta: true,
          novel: true,
        },
        sort: '-publishedAt',
        where: publishedNovelChapterPostsWhere,
      }),
    ])

  const items: ThemeSearchIndexItem[] = []

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

  for (const job of jobsResult.docs) {
    if (!job.title) continue

    const excerpt = [job.department, job.location].filter(Boolean).join(' · ')

    items.push({
      id: `job:${job.slug || job.id}`,
      title: job.title,
      url: getJobsPath(),
      excerpt: excerpt.slice(0, 200),
      body: excerpt.slice(0, 8000),
    })
  }

  for (const item of galleryResult.docs) {
    if (!item.title) continue

    const excerpt = item.description || ''

    items.push({
      id: `gallery:${item.id}`,
      title: item.title,
      url: getGalleryItemsPath(),
      excerpt: excerpt.slice(0, 200),
      body: excerpt.slice(0, 8000),
    })
  }

  for (const novel of novelsResult.docs) {
    if (!novel.slug || !novel.title) continue

    const body = [novel.synopsis, novel.writingStyle, novel.plotOutline].filter(Boolean).join('\n')
    const categories = novel.genre ? [novel.genre] : []

    items.push({
      id: `novel:${novel.slug}`,
      title: novel.title,
      url: getNovelPath(novel.slug),
      excerpt: (novel.synopsis || '').slice(0, 200),
      categories,
      tags: ['小说'],
      body: body.slice(0, 8000),
    })
  }

  for (const post of novelChaptersResult.docs) {
    if (!post.slug || !post.title) continue

    const novel = typeof post.novel === 'object' ? post.novel : null
    if (!novel?.slug || novel.enabled === false) continue

    const excerpt = post.meta?.description || post.title
    const categories = novel.genre ? [novel.genre] : []

    items.push({
      id: `novel-chapter:${novel.slug}:${post.slug}`,
      title: `${post.title}`,
      url: getNovelChapterPath(novel.slug, post.slug),
      excerpt: excerpt.slice(0, 200),
      categories,
      tags: ['小说', novel.title],
      body: excerpt.slice(0, 8000),
    })
  }

  return items
}
