import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { getServerSideURL } from '@/utilities/getURL'
import { slugifyAuthorName } from '@/utilities/queryBlogData'

export type SitemapUrlEntry = {
  loc: string
  lastmod: string
  changefreq?: string
  priority?: string
}

function toDateOnly(value: string | Date | null | undefined, fallback: string): string {
  if (!value) return fallback
  const d = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(d.getTime())) return fallback
  return d.toISOString().split('T')[0]
}

function pageLoc(siteUrl: string, slug: string): string {
  if (slug === 'home') return `${siteUrl}/`
  if (slug === 'about') return `${siteUrl}/about`
  return `${siteUrl}/pages/${slug}`
}

export async function buildBlogSitemapEntries(): Promise<SitemapUrlEntry[]> {
  const payload = await getPayload({ config: configPromise })
  const siteUrl = getServerSideURL().replace(/\/$/, '')
  const today = new Date().toISOString().split('T')[0]

  const [postsResult, pagesResult, categoriesResult, tagsResult, postsForAuthors] =
    await Promise.all([
      payload.find({
        collection: 'posts',
        depth: 0,
        draft: false,
        limit: 1000,
        overrideAccess: false,
        pagination: false,
        sort: '-publishedAt',
        where: { _status: { equals: 'published' } },
        select: { slug: true, updatedAt: true, publishedAt: true },
      }),
      payload.find({
        collection: 'pages',
        depth: 0,
        draft: false,
        limit: 1000,
        overrideAccess: false,
        pagination: false,
        where: { _status: { equals: 'published' } },
        select: { slug: true, updatedAt: true },
      }),
      payload.find({
        collection: 'categories',
        depth: 0,
        limit: 500,
        overrideAccess: false,
        pagination: false,
        select: { slug: true, updatedAt: true },
      }),
      payload.find({
        collection: 'tags',
        depth: 0,
        limit: 500,
        overrideAccess: false,
        pagination: false,
        select: { slug: true, updatedAt: true },
      }),
      payload.find({
        collection: 'posts',
        depth: 0,
        limit: 500,
        overrideAccess: false,
        pagination: false,
        select: { populatedAuthors: true },
        where: { _status: { equals: 'published' } },
      }),
    ])

  const urls: SitemapUrlEntry[] = [
    { loc: `${siteUrl}/`, lastmod: today, changefreq: 'daily', priority: '1.0' },
    { loc: `${siteUrl}/archives`, lastmod: today, changefreq: 'daily', priority: '0.9' },
    { loc: `${siteUrl}/links`, lastmod: today, changefreq: 'monthly', priority: '0.5' },
    { loc: `${siteUrl}/about`, lastmod: today, changefreq: 'monthly', priority: '0.6' },
    { loc: `${siteUrl}/navigations`, lastmod: today, changefreq: 'weekly', priority: '0.5' },
    { loc: `${siteUrl}/games`, lastmod: today, changefreq: 'weekly', priority: '0.5' },
    { loc: `${siteUrl}/games/math`, lastmod: today, changefreq: 'monthly', priority: '0.45' },
  ]

  for (const post of postsResult.docs) {
    if (!post.slug) continue
    urls.push({
      loc: `${siteUrl}/archives/${post.slug}`,
      lastmod: toDateOnly(post.updatedAt || post.publishedAt, today),
      changefreq: 'weekly',
      priority: '0.8',
    })
  }

  for (const page of pagesResult.docs) {
    if (!page.slug || page.slug === 'home') continue
    urls.push({
      loc: pageLoc(siteUrl, page.slug),
      lastmod: toDateOnly(page.updatedAt, today),
      changefreq: 'monthly',
      priority: '0.7',
    })
  }

  const authorSlugs = new Set<string>()
  for (const post of postsForAuthors.docs) {
    for (const author of post.populatedAuthors || []) {
      if (author?.name) {
        authorSlugs.add(slugifyAuthorName(author.name, author.id || author.name))
      }
    }
  }
  for (const slug of authorSlugs) {
    urls.push({
      loc: `${siteUrl}/authors/${slug}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.55',
    })
  }

  for (const category of categoriesResult.docs) {
    if (!category.slug) continue
    urls.push({
      loc: `${siteUrl}/categories/${category.slug}`,
      lastmod: toDateOnly(category.updatedAt, today),
      changefreq: 'weekly',
      priority: '0.6',
    })
  }

  for (const tag of tagsResult.docs) {
    if (!tag.slug) continue
    urls.push({
      loc: `${siteUrl}/tags/${tag.slug}`,
      lastmod: toDateOnly(tag.updatedAt, today),
      changefreq: 'weekly',
      priority: '0.5',
    })
  }

  return urls
}

export function renderSitemapXml(entries: SitemapUrlEntry[]): string {
  const body = entries
    .map((entry) => {
      const parts = [`    <loc>${escapeXml(entry.loc)}</loc>`, `    <lastmod>${entry.lastmod}</lastmod>`]
      if (entry.changefreq) parts.push(`    <changefreq>${entry.changefreq}</changefreq>`)
      if (entry.priority) parts.push(`    <priority>${entry.priority}</priority>`)
      return `  <url>\n${parts.join('\n')}\n  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
