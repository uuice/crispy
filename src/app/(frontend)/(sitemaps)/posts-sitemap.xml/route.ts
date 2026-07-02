import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'

import { getResolvedCacheSettings } from '@/frontend-cache/getCacheSettings'
import { withRouteCacheHeaders } from '@/frontend-cache/withRouteCacheHeaders'
import { getPostPath } from '@/utilities/frontendPaths'

async function getPostsSitemap() {
  const payload = await getPayload({ config })
  const SITE_URL =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    'https://example.com'

  const results = await payload.find({
    collection: 'posts',
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

  return results.docs
    ? results.docs
        .filter((post) => Boolean(post?.slug))
        .map((post) => ({
          loc: `${SITE_URL}${getPostPath(post?.slug || '')}`,
          lastmod: post.updatedAt || dateFallback,
        }))
    : []
}

export async function GET() {
  const cacheSettings = await getResolvedCacheSettings()
  const sitemap = await getPostsSitemap()
  const response = await getServerSideSitemap(sitemap)
  return withRouteCacheHeaders(response, cacheSettings)
}
