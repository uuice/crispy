import { buildVirtualMediaSizes } from '@/uploads/ossVirtualSizes'
import { isOssVirtualSizesEnabled } from '@/uploads/isOssVirtualSizesEnabled'

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function isAbsoluteHttpUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://')
}

/**
 * Admin list thumbnails: return a direct OSS resize URL when virtual sizes are enabled.
 * Payload's string adminThumbnail only selects sizes.*.filename in list queries, which forces
 * /api/media/file proxy URLs even when sizes_thumbnail_url points at OSS.
 */
export function resolveAdminMediaThumbnailUrl(doc: Record<string, unknown>): string | null {
  const mimeType = typeof doc.mimeType === 'string' ? doc.mimeType : ''
  if (!mimeType.startsWith('image/')) return null

  if (isOssVirtualSizesEnabled()) {
    const url = typeof doc.url === 'string' ? doc.url : ''
    if (url) {
      const sizes = buildVirtualMediaSizes({
        url,
        filename: typeof doc.filename === 'string' ? doc.filename : null,
        prefix: typeof doc.prefix === 'string' ? doc.prefix : null,
        mimeType,
        width: toNumber(doc.width),
        height: toNumber(doc.height),
      })

      const thumbUrl = sizes?.thumbnail?.url
      if (thumbUrl) return thumbUrl
    }
  }

  const sizes = doc.sizes
  if (sizes && typeof sizes === 'object' && 'thumbnail' in sizes) {
    const thumb = (sizes as { thumbnail?: { url?: unknown } }).thumbnail
    if (typeof thumb?.url === 'string' && isAbsoluteHttpUrl(thumb.url)) {
      return thumb.url
    }
  }

  const thumbnailURL = doc.thumbnailURL
  if (typeof thumbnailURL === 'string' && isAbsoluteHttpUrl(thumbnailURL)) {
    return thumbnailURL
  }

  return null
}
