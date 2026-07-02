import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function cdata(value: string): string {
  return `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`
}

export async function buildBlogRssXml(options?: { feedPath?: string; limit?: number }): Promise<string> {
  const feedPath = options?.feedPath ?? '/rss.xml'
  const limit = options?.limit ?? 50

  const payload = await getPayload({ config: configPromise })
  const siteUrl = getServerSideURL().replace(/\/$/, '')

  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  if (settings.enableRss === false) {
    throw new Error('RSS disabled')
  }

  const siteName = settings.siteName || 'Crispy'
  const siteDescription = settings.siteDescription || ''

  const { docs } = await payload.find({
    collection: 'posts',
    depth: 1,
    limit,
    overrideAccess: false,
    pagination: false,
    sort: '-publishedAt',
    where: { _status: { equals: 'published' } },
  })

  const items = docs
    .map((post: Post) => {
      const link = `${siteUrl}/archives/${post.slug}`
      const pubDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : ''
      const description = post.meta?.description || post.title || ''
      const categories = (post.categories || [])
        .map((category) =>
          typeof category === 'object' && category?.title
            ? `<category>${cdata(category.title)}</category>`
            : '',
        )
        .filter(Boolean)
        .join('\n      ')

      return `<item>
    <title>${cdata(post.title)}</title>
    <link>${escapeXml(link)}</link>
    <guid isPermaLink="true">${escapeXml(link)}</guid>
    <description>${cdata(description)}</description>
    <content:encoded>${cdata(description)}</content:encoded>
    ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ''}
    ${categories}
  </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(`${siteUrl}${feedPath}`)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`
}
