import { getResolvedCacheSettings } from '@/frontend-cache/getCacheSettings'
import { withRouteCacheHeaders } from '@/frontend-cache/withRouteCacheHeaders'
import { buildBlogSitemapEntries, renderSitemapXml } from '@/utilities/buildBlogSitemap'

export const revalidate = false

export async function GET() {
  const cacheSettings = await getResolvedCacheSettings()
  const entries = await buildBlogSitemapEntries()
  const xml = renderSitemapXml(entries)
  const ttlSeconds = cacheSettings.pageRevalidateSeconds

  const response = new Response(xml, {
    headers: {
      'Cache-Control': `public, s-maxage=${ttlSeconds}, stale-while-revalidate=${ttlSeconds * 6}`,
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })

  return withRouteCacheHeaders(response, cacheSettings)
}
