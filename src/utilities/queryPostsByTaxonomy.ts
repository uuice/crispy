import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { CardPostData } from '@/components/Card'

const POST_SELECT = {
  title: true,
  slug: true,
  categories: true,
  tags: true,
  meta: true,
} as const

export const queryPostsByCategorySlug = cache(async (slug: string, page = 1, limit = 12) => {
  const payload = await getPayload({ config: configPromise })

  const categoryResult = await payload.find({
    collection: 'categories',
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: { slug: { equals: slug } },
  })

  const category = categoryResult.docs[0]
  if (!category) return { category: null, posts: null }

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit,
    page,
    overrideAccess: false,
    select: POST_SELECT,
    sort: '-publishedAt',
    where: {
      _status: { equals: 'published' },
      categories: { contains: category.id },
    },
  })

  return { category, posts }
})

export const queryPostsByTagSlug = cache(async (slug: string, page = 1, limit = 12) => {
  const payload = await getPayload({ config: configPromise })

  const tagResult = await payload.find({
    collection: 'tags',
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: { slug: { equals: slug } },
  })

  const tag = tagResult.docs[0]
  if (!tag) return { tag: null, posts: null }

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit,
    page,
    overrideAccess: false,
    select: POST_SELECT,
    sort: '-publishedAt',
    where: {
      _status: { equals: 'published' },
      tags: { contains: tag.id },
    },
  })

  return { tag, posts }
})

export type ArchiveGroup = {
  year: number
  months: {
    month: number
    label: string
    posts: CardPostData[]
  }[]
}

export const queryArchiveGroups = cache(async (): Promise<ArchiveGroup[]> => {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'posts',
    depth: 0,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      title: true,
      slug: true,
      publishedAt: true,
    },
    sort: '-publishedAt',
    where: { _status: { equals: 'published' } },
  })

  const groups = new Map<number, Map<number, CardPostData[]>>()

  for (const post of docs) {
    if (!post.publishedAt || !post.slug || !post.title) continue

    const date = new Date(post.publishedAt)
    const year = date.getFullYear()
    const month = date.getMonth() + 1

    if (!groups.has(year)) groups.set(year, new Map())
    const monthMap = groups.get(year)!
    if (!monthMap.has(month)) monthMap.set(month, [])

    monthMap.get(month)!.push({
      title: post.title,
      slug: post.slug,
    })
  }

  const monthFormatter = new Intl.DateTimeFormat('zh-CN', { month: 'long' })

  return [...groups.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, monthMap]) => ({
      year,
      months: [...monthMap.entries()]
        .sort(([a], [b]) => b - a)
        .map(([month, posts]) => ({
          month,
          label: monthFormatter.format(new Date(year, month - 1, 1)),
          posts,
        })),
    }))
})
