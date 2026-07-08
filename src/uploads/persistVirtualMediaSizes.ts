import { sql } from '@payloadcms/db-postgres'
import type { PayloadRequest } from 'payload'

import type { Media } from '@/payload-types'
import { MEDIA_IMAGE_SIZES } from '@/uploads/mediaImageSizes'

type VirtualSizes = NonNullable<Media['sizes']>

function mediaSizeColumnPrefix(name: string): string {
  return `sizes_${name.replace(/-/g, '_')}`
}

/** Build SQL SET clauses for OSS virtual size columns (bypasses Payload readOnly upload fields). */
export function buildVirtualMediaSizesSqlSets(
  sizes: VirtualSizes,
  thumbnailURL?: string | null,
) {
  const sets = []

  if (thumbnailURL != null) {
    sets.push(sql`thumbnail_u_r_l = ${thumbnailURL}`)
  }

  for (const sizeDef of MEDIA_IMAGE_SIZES) {
    const entry = sizes[sizeDef.name as keyof VirtualSizes]
    if (!entry) continue

    const prefix = mediaSizeColumnPrefix(sizeDef.name)
    sets.push(sql`${sql.raw(`"${prefix}_url"`)} = ${entry.url ?? null}`)
    sets.push(sql`${sql.raw(`"${prefix}_width"`)} = ${entry.width ?? null}`)
    sets.push(sql`${sql.raw(`"${prefix}_height"`)} = ${entry.height ?? null}`)
    sets.push(sql`${sql.raw(`"${prefix}_mime_type"`)} = ${entry.mimeType ?? null}`)
    sets.push(sql`${sql.raw(`"${prefix}_filename"`)} = ${entry.filename ?? null}`)
  }

  return sets
}

export async function persistVirtualMediaSizes(
  req: PayloadRequest,
  mediaId: number | string,
  sizes: VirtualSizes,
  thumbnailURL?: string | null,
): Promise<void> {
  const drizzle = req.payload.db.drizzle
  if (!drizzle) {
    throw new Error('Database drizzle client unavailable')
  }

  const sets = buildVirtualMediaSizesSqlSets(sizes, thumbnailURL)
  if (sets.length === 0) return

  await drizzle.execute(sql`
    UPDATE media
    SET ${sql.join(sets, sql`, `)}
    WHERE id = ${mediaId}
  `)
}
