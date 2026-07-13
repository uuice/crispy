import { getResolvedCacheSettings } from '@/frontend-cache/getCacheSettings'
import { withRouteCacheHeaders } from '@/frontend-cache/withRouteCacheHeaders'
import { buildBlogRssXml } from '@/utilities/buildBlogRss'

export const dynamic = 'force-dynamic'
export const revalidate = false

export async function GET() {
  const cacheSettings = await getResolvedCacheSettings()

  try {
    const xml = await buildBlogRssXml({ feedPath: '/rss' })
    const ttlSeconds = cacheSettings.pageRevalidateSeconds

    const response = new Response(xml.trim(), {
      headers: {
        'Cache-Control': `public, s-maxage=${ttlSeconds}, stale-while-revalidate=${ttlSeconds * 6}`,
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    })

    return withRouteCacheHeaders(response, cacheSettings)
  } catch (error) {
    if (error instanceof Error && error.message === 'RSS disabled') {
      return new Response('RSS disabled', { status: 404 })
    }
    throw error
  }
}
