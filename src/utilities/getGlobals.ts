import type { Config } from '@/payload-types'

import configPromise from '@payload-config'
import { cache } from 'react'
import { type DataFromGlobalSlug, getPayload } from 'payload'

type Global = keyof Config['globals']

async function getGlobal<T extends Global>(slug: T, depth = 0): Promise<DataFromGlobalSlug<T>> {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
  })

  return global
}

const getGlobalCached = cache(
  async (slug: string, depth: number) => getGlobal(slug as Global, depth),
)

/** Request-scoped dedupe for global reads (page HTML cache handles cross-request caching). */
export const getCachedGlobal = <T extends Global>(slug: T, depth = 0) =>
  async (): Promise<DataFromGlobalSlug<T>> =>
    getGlobalCached(slug, depth) as Promise<DataFromGlobalSlug<T>>
