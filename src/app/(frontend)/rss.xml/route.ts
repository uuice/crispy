import configPromise from '@payload-config'
import { getPayload } from 'payload'

import {
  resolveDataCacheStatus,
  runWithDataCacheProbeAsync,
} from '@/frontend-cache/dataCacheProbe'
import { withRouteCacheHeaders } from '@/frontend-cache/withRouteCacheHeaders'
import { PAGE_REVALIDATE_SECONDS } from '@/frontend-cache/constants'
import { getCachedSiteSettings } from '@/utilities/getSiteSettings'
import { getServerSideURL } from '@/utilities/getURL'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  return runWithDataCacheProbeAsync(async () => {
    const settings = await getCachedSiteSettings()()

    if (settings.enableRss === false) {
      return new Response('RSS disabled', { status: 404 })
    }

    const payload = await getPayload({ config: configPromise })
    const siteUrl = getServerSideURL()
    const siteName = settings.siteName || 'Crispy'
    const siteDescription = settings.siteDescription || ''

    const { docs } = await payload.find({
      collection: 'posts',
      depth: 1,
      limit: 50,
      overrideAccess: false,
      pagination: false,
      sort: '-publishedAt',
      where: { _status: { equals: 'published' } },
    })

    const items = docs
      .map((post) => {
        const link = `${siteUrl}/posts/${post.slug}`
        const pubDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : ''
        const description = post.meta?.description || ''

        return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ''}
      ${description ? `<description>${escapeXml(description)}</description>` : ''}
    </item>`
      })
      .join('')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>zh-CN</language>${items}
  </channel>
</rss>`

    const dataStatus = resolveDataCacheStatus()
    const response = new Response(xml.trim(), {
      headers: {
        'Cache-Control': `public, s-maxage=${PAGE_REVALIDATE_SECONDS}, stale-while-revalidate=${PAGE_REVALIDATE_SECONDS * 6}`,
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    })

    return withRouteCacheHeaders(response, dataStatus)
  })
}

export const revalidate = PAGE_REVALIDATE_SECONDS
