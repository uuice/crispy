import { unstable_cache } from 'next/cache'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function getRedirects(depth = 1) {
  const payload = await getPayload({ config: configPromise })

  const { docs: redirects } = await payload.find({
    collection: 'redirects',
    depth,
    limit: 0,
    pagination: false,
  })

  return redirects
}

const getCachedRedirectsImpl = unstable_cache(
  async () => getRedirects(1),
  ['payload-redirects'],
  { revalidate: 60 },
)

export const getCachedRedirects = getCachedRedirectsImpl
