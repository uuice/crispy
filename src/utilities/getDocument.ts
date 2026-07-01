import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { dbCacheWithProbe } from '@/frontend-cache/unstableCacheWithProbe'

type Collection = keyof Config['collections']

async function getDocument(collection: Collection, slug: string, depth = 0) {
  const payload = await getPayload({ config: configPromise })

  const page = await payload.find({
    collection,
    depth,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return page.docs[0]
}

export const getCachedDocument = (collection: Collection, slug: string) =>
  dbCacheWithProbe(
    async () => getDocument(collection, slug),
    [collection, slug],
    [`${collection}_${slug}`],
  )
