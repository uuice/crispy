import type { Media } from '@/payload-types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

type MediaResource = Pick<Media, 'url' | 'updatedAt' | 'width' | 'height' | 'sizes'>

/** Prefer OSS virtual size URLs; skip Next.js image optimizer for external URLs (no Sharp). */
export function resolveMediaImageSrc(resource: MediaResource): {
  src: string
  width?: number | null
  height?: number | null
  unoptimized: boolean
} {
  const sized =
    resource.sizes?.large ??
    resource.sizes?.medium ??
    resource.sizes?.xlarge ??
    resource.sizes?.small

  const rawUrl = sized?.url ?? resource.url ?? ''
  const src = getMediaUrl(rawUrl, resource.updatedAt)
  const unoptimized = src.startsWith('http://') || src.startsWith('https://')

  return {
    src,
    width: sized?.width ?? resource.width,
    height: sized?.height ?? resource.height,
    unoptimized,
  }
}
