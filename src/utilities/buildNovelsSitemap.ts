import configPromise from '@payload-config'
import { getPayload } from 'payload'

import {
  getNovelChapterPath,
  getNovelPath,
  getNovelsPath,
} from '@/utilities/frontendPaths'
import { publishedNovelChapterPostsWhere } from '@/utilities/publishedBlogPostsWhere'
import { getServerSideURL } from '@/utilities/getURL'

import type { SitemapUrlEntry } from './buildBlogSitemap'

function toDateOnly(value: string | Date | null | undefined, fallback: string): string {
  if (!value) return fallback
  const d = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(d.getTime())) return fallback
  return d.toISOString().split('T')[0]
}

export async function buildNovelSitemapEntries(siteUrlInput?: string): Promise<SitemapUrlEntry[]> {
  const payload = await getPayload({ config: configPromise })
  const siteUrl = (siteUrlInput || getServerSideURL()).replace(/\/$/, '')
  const today = new Date().toISOString().split('T')[0]

  const [novelsResult, novelChaptersResult] = await Promise.all([
    payload.find({
      collection: 'novels',
      depth: 0,
      limit: 500,
      overrideAccess: false,
      pagination: false,
      where: { enabled: { equals: true } },
      select: { slug: true, updatedAt: true },
    }),
    payload.find({
      collection: 'posts',
      depth: 1,
      draft: false,
      limit: 5000,
      overrideAccess: false,
      pagination: false,
      sort: '-publishedAt',
      where: publishedNovelChapterPostsWhere,
      select: { slug: true, updatedAt: true, publishedAt: true, novel: true },
    }),
  ])

  const urls: SitemapUrlEntry[] = [
    {
      loc: `${siteUrl}${getNovelsPath()}`,
      lastmod: today,
      changefreq: 'daily',
      priority: '0.85',
    },
  ]

  for (const novel of novelsResult.docs) {
    if (!novel.slug) continue
    urls.push({
      loc: `${siteUrl}${getNovelPath(novel.slug)}`,
      lastmod: toDateOnly(novel.updatedAt, today),
      changefreq: 'weekly',
      priority: '0.75',
    })
  }

  for (const post of novelChaptersResult.docs) {
    if (!post.slug) continue
    const novel = typeof post.novel === 'object' ? post.novel : null
    if (!novel?.slug || novel.enabled === false) continue
    urls.push({
      loc: `${siteUrl}${getNovelChapterPath(novel.slug, post.slug)}`,
      lastmod: toDateOnly(post.updatedAt || post.publishedAt, today),
      changefreq: 'weekly',
      priority: '0.7',
    })
  }

  return urls
}

export async function getNovelsSitemapForNextSitemap(siteUrlInput?: string) {
  const entries = await buildNovelSitemapEntries(siteUrlInput)
  return entries.map(({ loc, lastmod }) => ({ loc, lastmod }))
}
