import { getServerSideSitemap } from 'next-sitemap'

import { getResolvedCacheSettings } from '@/frontend-cache/getCacheSettings'
import { withRouteCacheHeaders } from '@/frontend-cache/withRouteCacheHeaders'
import { getNovelsSitemapForNextSitemap } from '@/utilities/buildNovelsSitemap'

async function getNovelsSitemap() {
  const SITE_URL =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    'https://example.com'

  return getNovelsSitemapForNextSitemap(SITE_URL)
}

export async function GET() {
  const cacheSettings = await getResolvedCacheSettings()
  const sitemap = await getNovelsSitemap()
  const response = await getServerSideSitemap(sitemap)
  return withRouteCacheHeaders(response, cacheSettings)
}
