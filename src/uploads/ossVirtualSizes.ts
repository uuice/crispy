import type { Media } from '@/payload-types'

import type { MediaImageSize } from '@/uploads/mediaImageSizes'
import { MEDIA_IMAGE_SIZES } from '@/uploads/mediaImageSizes'
import { buildOssEndpointUrl, buildOssPublicUrl } from '@/uploads/ossObjectKey'

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

/** Parse Payload S3 proxy paths: `/api/media/file/name.jpg?prefix=crispy%2F2026%2F07%2F08`. */
export function parsePayloadMediaProxyUrl(url: string): {
  filename?: string
  prefix?: string
} {
  try {
    const parsed = new URL(url, 'http://local.invalid')
    const marker = '/api/media/file/'
    if (!parsed.pathname.startsWith(marker)) return {}

    const filename = decodeURIComponent(parsed.pathname.slice(marker.length))
    if (!filename) return {}

    const prefixParam = parsed.searchParams.get('prefix')
    return {
      filename,
      prefix: prefixParam ? decodeURIComponent(prefixParam) : undefined,
    }
  } catch {
    return {}
  }
}

/** Resolve a public OSS URL for x-oss-process (Aliyun image processing). */
export function resolveMediaOriginalUrl(input: {
  url: string
  filename?: string | null
  prefix?: string | null
}): string | null {
  const { url } = input
  if (!url) return null

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return stripOssProcessParams(url)
  }

  const fromProxy = parsePayloadMediaProxyUrl(url)
  const filename = input.filename || fromProxy.filename
  const docPrefix = input.prefix || fromProxy.prefix

  if (filename) {
    const publicUrl = buildOssPublicUrl({ docPrefix, filename })
    if (publicUrl) return publicUrl

    const endpointUrl = buildOssEndpointUrl({ docPrefix, filename })
    if (endpointUrl) return endpointUrl
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
  prefix?: string | null
  mimeType?: string | null
  width?: number | null
  height?: number | null
  sizes?: MediaImageSize[]
}): NonNullable<Media['sizes']> | null {
  const originalUrl = resolveMediaOriginalUrl({
    url: input.url,
    filename: input.filename,
    prefix: input.prefix,
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
