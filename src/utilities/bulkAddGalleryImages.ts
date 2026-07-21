import type { Payload, PayloadRequest } from 'payload'

export type BulkAddGalleryImagesResult = {
  created: number
  skipped: number
  itemIds: number[]
}

function toNumericId(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() && Number.isFinite(Number(value))) {
    return Number(value)
  }
  if (value && typeof value === 'object' && 'id' in value) {
    return toNumericId((value as { id: unknown }).id)
  }
  return null
}

function normalizeMediaIds(raw: unknown): number[] {
  if (!Array.isArray(raw)) return []
  const ids: number[] = []
  for (const entry of raw) {
    const id = toNumericId(entry)
    if (id != null) ids.push(id)
  }
  return [...new Set(ids)]
}

function titleFromMedia(media: {
  alt?: string | null
  filename?: string | null
  id: number
}): string {
  const alt = typeof media.alt === 'string' ? media.alt.trim() : ''
  if (alt) return alt
  const filename = typeof media.filename === 'string' ? media.filename.trim() : ''
  if (filename) return filename.replace(/\.[^.]+$/, '') || filename
  return `图片 ${media.id}`
}

/** Create gallery-items for media IDs; skip images already in the gallery. */
export async function bulkAddGalleryImages(args: {
  payload: Payload
  galleryId: string | number
  mediaIds: unknown
  req?: PayloadRequest
}): Promise<BulkAddGalleryImagesResult> {
  const galleryId = toNumericId(args.galleryId)
  if (galleryId == null) {
    throw new Error('galleryId 无效')
  }

  const mediaIds = normalizeMediaIds(args.mediaIds)
  if (mediaIds.length === 0) {
    return { created: 0, skipped: 0, itemIds: [] }
  }

  // Prefer Payload access when req is present (Admin / Agent). Avoid binding media the user cannot read.
  const access = args.req
    ? { req: args.req, overrideAccess: false as const }
    : { overrideAccess: true as const }

  const existing = await args.payload.find({
    collection: 'gallery-items',
    depth: 0,
    limit: 500,
    pagination: false,
    where: {
      and: [
        { gallery: { equals: galleryId } },
        { image: { in: mediaIds } },
      ],
    },
    select: { image: true },
    ...access,
  })

  const existingImageIds = new Set(
    existing.docs
      .map((doc) => toNumericId(doc.image))
      .filter((id): id is number => id != null),
  )

  const sortBase = await args.payload.find({
    collection: 'gallery-items',
    depth: 0,
    limit: 1,
    pagination: false,
    sort: '-sort',
    where: { gallery: { equals: galleryId } },
    select: { sort: true },
    ...access,
  })
  let nextSort = typeof sortBase.docs[0]?.sort === 'number' ? sortBase.docs[0].sort + 1 : 0

  let created = 0
  let skipped = 0
  const itemIds: number[] = []

  for (const mediaId of mediaIds) {
    if (existingImageIds.has(mediaId)) {
      skipped += 1
      continue
    }

    let title = `图片 ${mediaId}`
    try {
      const media = await args.payload.findByID({
        collection: 'media',
        id: mediaId,
        depth: 0,
        ...access,
      })
      title = titleFromMedia(media)
    } catch {
      skipped += 1
      continue
    }

    const item = await args.payload.create({
      collection: 'gallery-items',
      data: {
        gallery: galleryId,
        image: mediaId,
        title,
        sort: nextSort,
        enabled: true,
      },
      context: { skipAuditLog: true },
      ...access,
    })
    itemIds.push(item.id)
    existingImageIds.add(mediaId)
    nextSort += 1
    created += 1
  }

  return { created, skipped, itemIds }
}
