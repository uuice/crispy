import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'

import { getResolvedCacheSettings } from '@/frontend-cache/getCacheSettings'
import { withRouteCacheHeaders } from '@/frontend-cache/withRouteCacheHeaders'
import { getPagePath, getPostsListPath } from '@/utilities/frontendPaths'

export const dynamic = 'force-dynamic'

function pageSitemapLoc(siteUrl: string, slug: string): string {
  return `${siteUrl}${getPagePath(slug)}`
}

async function getPagesSitemap() {
  const payload = await getPayload({ config })
  const SITE_URL =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    'https://example.com'

  const results = await payload.find({
    collection: 'pages',
    overrideAccess: false,
    draft: false,
    depth: 0,
    limit: 1000,
    pagination: false,
    where: {
      _status: {
        equals: 'published',
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const dateFallback = new Date().toISOString()

  const staticPages = [
    { loc: `${SITE_URL}${getPostsListPath()}`, lastmod: dateFallback },
    { loc: `${SITE_URL}/links`, lastmod: dateFallback },
    { loc: `${SITE_URL}/navigations`, lastmod: dateFallback },
  ]

  const sitemap = results.docs
    ? results.docs
        .filter((page) => Boolean(page?.slug))
        .map((page) => ({
          loc: pageSitemapLoc(SITE_URL, page.slug),
          lastmod: page.updatedAt || dateFallback,
        }))
    : []

  return [...staticPages, ...sitemap]
}

export async function GET() {
  const cacheSettings = await getResolvedCacheSettings()
  const sitemap = await getPagesSitemap()
  const response = await getServerSideSitemap(sitemap)
  return withRouteCacheHeaders(response, cacheSettings)
}
