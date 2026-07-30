/**
 * Backfill OSS virtual size URLs for existing media rows (images only).
 *
 * Usage: pnpm cli util:sync-oss-sizes
 */
import { getPayload } from 'payload'

import config from '@/payload.config'
import { buildVirtualMediaSizes } from '@/uploads/ossVirtualSizes'
import { isOssVirtualSizesEnabled } from '@/uploads/isOssVirtualSizesEnabled'
import { persistVirtualMediaSizes } from '@/uploads/persistVirtualMediaSizes'

async function main() {
  if (!isOssVirtualSizesEnabled()) {
    console.error('OSS virtual sizes disabled (Admin storage-settings not S3 or virtualSizes off)')
    process.exit(1)
  }

  const payload = await getPayload({ config })
  let page = 1
  let updated = 0

  while (true) {
    const batch = await payload.find({
      collection: 'media',
      limit: 50,
      page,
      depth: 0,
      pagination: true,
    })

    if (!batch.docs.length) break

    for (const doc of batch.docs) {
      const mimeType = typeof doc.mimeType === 'string' ? doc.mimeType : ''
      const url = typeof doc.url === 'string' ? doc.url : ''
      if (!mimeType.startsWith('image/') || !url) continue

      const sizes = buildVirtualMediaSizes({
        url,
        filename: typeof doc.filename === 'string' ? doc.filename : null,
        prefix: typeof doc.prefix === 'string' ? doc.prefix : null,
        mimeType,
        width: typeof doc.width === 'number' ? doc.width : null,
        height: typeof doc.height === 'number' ? doc.height : null,
      })

      if (!sizes) {
        console.warn(`skip media:${doc.id} — could not resolve OSS URL`)
        continue
      }

      const largeUrl = sizes.large?.url ?? ''
      if (largeUrl.startsWith('http') && doc.sizes?.large?.url === largeUrl) {
        continue
      }

      await persistVirtualMediaSizes(reqFromPayload(payload), doc.id, sizes, sizes.thumbnail?.url)
      updated++
      console.log(`updated media:${doc.id} ${doc.filename ?? ''}`)
    }

    if (!batch.hasNextPage) break
    page++
  }

  console.log(`Done. Updated ${updated} media row(s).`)
  process.exit(0)
}

function reqFromPayload(payload: Awaited<ReturnType<typeof getPayload>>) {
  return { payload } as Parameters<typeof persistVirtualMediaSizes>[0]
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
