import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { NovelChapter } from '@/payload-types'
import { getNovelChapterPath } from '@/utilities/frontendPaths'
import { publishedNovelChaptersWhere } from '@/utilities/publishedContentWhere'
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

export async function buildNovelRssXml(options?: { feedPath?: string; limit?: number }): Promise<string> {
  const feedPath = options?.feedPath ?? '/novels/rss.xml'
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
    collection: 'novel-chapters',
    depth: 1,
    limit,
    overrideAccess: false,
    pagination: false,
    sort: '-publishedAt',
    where: publishedNovelChaptersWhere,
  })

  const items = docs
    .map((chapter: NovelChapter) => {
      const novel = typeof chapter.novel === 'object' ? chapter.novel : null
      if (!novel?.slug || novel.enabled === false || !chapter.slug) return ''

      const link = `${siteUrl}${getNovelChapterPath(novel.slug, chapter.slug)}`
      const pubDate = chapter.publishedAt ? new Date(chapter.publishedAt).toUTCString() : ''
      const description = chapter.meta?.description || chapter.title || ''
      const itemTitle = `[${novel.title}] ${chapter.title}`

      return `<item>
    <title>${cdata(itemTitle)}</title>
    <link>${escapeXml(link)}</link>
    <guid isPermaLink="true">${escapeXml(link)}</guid>
    <description>${cdata(description)}</description>
    <content:encoded>${cdata(description)}</content:encoded>
    ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ''}
    <category>${cdata(novel.title)}</category>
  </item>`
    })
    .filter(Boolean)
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${siteName} · 小说`)}</title>
    <link>${escapeXml(`${siteUrl}/novels`)}</link>
    <description>${escapeXml(siteDescription || '小说章节更新')}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(`${siteUrl}${feedPath}`)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`
}
