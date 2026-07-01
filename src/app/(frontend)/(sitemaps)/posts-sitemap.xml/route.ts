import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'

import {
  resolveDataCacheStatus,
  runWithDataCacheProbeAsync,
} from '@/frontend-cache/dataCacheProbe'
import { unstableCacheWithProbe } from '@/frontend-cache/unstableCacheWithProbe'
import { withRouteCacheHeaders } from '@/frontend-cache/withRouteCacheHeaders'

const getPostsSitemap = unstableCacheWithProbe(
  async () => {
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

    const sitemap = results.docs
      ? results.docs
          .filter((post) => Boolean(post?.slug))
          .map((post) => ({
            loc: `${SITE_URL}/posts/${post?.slug}`,
            lastmod: post.updatedAt || dateFallback,
          }))
      : []

    return sitemap
  },
  ['posts-sitemap'],
  ['posts-sitemap'],
)

export async function GET() {
  return runWithDataCacheProbeAsync(async () => {
    const sitemap = await getPostsSitemap()
    const dataStatus = resolveDataCacheStatus()
    const response = await getServerSideSitemap(sitemap)
    return withRouteCacheHeaders(response, dataStatus)
  })
}
