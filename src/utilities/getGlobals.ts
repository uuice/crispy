import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { type DataFromGlobalSlug, getPayload } from 'payload'

import { unstableCacheWithProbe } from '@/frontend-cache/unstableCacheWithProbe'

type Global = keyof Config['globals']

async function getGlobal<T extends Global>(slug: T, depth = 0): Promise<DataFromGlobalSlug<T>> {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
  })

  return global
}

/**
 * Returns a DB-cached function mapped with the cache tag for the slug.
 */
export const getCachedGlobal = <T extends Global>(slug: T, depth = 0) =>
  unstableCacheWithProbe(async () => getGlobal<T>(slug, depth), [slug], [`global_${slug}`])
