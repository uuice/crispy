import type { Media } from '@/payload-types'

import type { MediaImageSize } from '@/uploads/mediaImageSizes'
import { MEDIA_IMAGE_SIZES } from '@/uploads/mediaImageSizes'

export type VirtualMediaSizeEntry = NonNullable<Media['sizes']>[keyof NonNullable<Media['sizes']>]

function stripOssProcessParams(url: string): string {
  try {
    const parsed = new URL(url)
    parsed.searchParams.delete('x-oss-process')
    const query = parsed.searchParams.toString()
    return query ? `${parsed.origin}${parsed.pathname}?${query}` : `${parsed.origin}${parsed.pathname}`
  } catch {
    return url.split('?')[0] ?? url
  }
}

/** Resolve a public OSS URL for x-oss-process (Aliyun image processing). */
export function resolveMediaOriginalUrl(input: {
  url: string
  filename?: string | null
}): string | null {
  const { url, filename } = input
  if (!url) return null

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return stripOssProcessParams(url)
  }

  const publicBase = process.env.S3_PUBLIC_BASE_URL?.replace(/\/$/, '')
  if (publicBase && filename) {
    const prefix = process.env.S3_PREFIX ?? 'media'
    return `${publicBase}/${prefix}/${encodeURIComponent(filename)}`
  }

  const endpoint = process.env.S3_ENDPOINT?.replace(/\/$/, '')
  const bucket = process.env.S3_BUCKET
  if (endpoint && bucket && filename) {
    const prefix = process.env.S3_PREFIX ?? 'media'
    return `${endpoint}/${bucket}/${prefix}/${encodeURIComponent(filename)}`
  }

  return null
}

/** Build Aliyun OSS `x-oss-process` value for a Payload imageSize entry. */
export function buildAliyunOssProcess(size: MediaImageSize): string {
  const width = size.width
  const height = size.height

  if (width && height && size.crop !== 'false') {
    return `image/resize,m_fill,w_${width},h_${height}`
  }

  if (width) {
    return `image/resize,w_${width}`
  }

  return 'image/resize'
}

export function appendAliyunOssProcess(baseUrl: string, process: string): string {
  const url = new URL(baseUrl)
  url.searchParams.set('x-oss-process', process)
  return url.toString()
}

function estimateHeight(
  sourceWidth: number | null | undefined,
  sourceHeight: number | null | undefined,
  targetWidth: number,
): number | null {
  if (!sourceWidth || !sourceHeight || sourceWidth <= 0) return null
  return Math.round((sourceHeight / sourceWidth) * targetWidth)
}

export function buildVirtualMediaSizes(input: {
  url: string
  filename?: string | null
  mimeType?: string | null
  width?: number | null
  height?: number | null
  sizes?: MediaImageSize[]
}): NonNullable<Media['sizes']> | null {
  const originalUrl = resolveMediaOriginalUrl({
    url: input.url,
    filename: input.filename,
  })

  if (!originalUrl) return null

  const mimeType = input.mimeType ?? 'image/jpeg'
  const sizeDefs = input.sizes ?? MEDIA_IMAGE_SIZES
  const result: NonNullable<Media['sizes']> = {}

  for (const sizeDef of sizeDefs) {
    const process = buildAliyunOssProcess(sizeDef)
    const variantUrl = appendAliyunOssProcess(originalUrl, process)
    const targetWidth = sizeDef.width ?? null
    const targetHeight =
      sizeDef.height ??
      (targetWidth ? estimateHeight(input.width, input.height, targetWidth) : null)

    result[sizeDef.name as keyof NonNullable<Media['sizes']>] = {
      url: variantUrl,
      width: targetWidth,
      height: targetHeight,
      mimeType,
      filesize: null,
      filename: input.filename ?? null,
    }
  }

  return result
}
