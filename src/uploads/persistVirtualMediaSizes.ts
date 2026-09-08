import { sql } from '@payloadcms/db-postgres'
import type { PayloadRequest } from 'payload'

import type { Media } from '@/payload-types'
import { MEDIA_IMAGE_SIZES } from '@/uploads/mediaImageSizes'

type VirtualSizes = NonNullable<Media['sizes']>

type DrizzleClient = {
  execute?: (query: unknown) => Promise<unknown> | unknown
  run?: (query: unknown) => Promise<unknown> | unknown
}

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
    // Do not write sizes_*_filename: duplicate original filenames exist in media,
    // and Payload's unique filename index can fail the whole UPDATE.
  }

  return sets
}

async function runDrizzleSql(drizzle: DrizzleClient, query: unknown): Promise<void> {
  // Postgres drizzle exposes execute(); SQLite/libsql uses run().
  if (typeof drizzle.execute === 'function') {
    await drizzle.execute(query)
    return
  }
  if (typeof drizzle.run === 'function') {
    await drizzle.run(query)
    return
  }
  throw new Error('Database drizzle client has neither execute() nor run()')
}

export async function persistVirtualMediaSizes(
  req: PayloadRequest,
  mediaId: number | string,
  sizes: VirtualSizes,
  thumbnailURL?: string | null,
): Promise<void> {
  const drizzle = req.payload.db.drizzle as DrizzleClient | undefined
  if (!drizzle) {
    throw new Error('Database drizzle client unavailable')
  }

  const sets = buildVirtualMediaSizesSqlSets(sizes, thumbnailURL)
  if (sets.length === 0) return

  await runDrizzleSql(
    drizzle,
    sql`
    UPDATE media
    SET ${sql.join(sets, sql`, `)}
    WHERE id = ${mediaId}
  `,
  )
}
