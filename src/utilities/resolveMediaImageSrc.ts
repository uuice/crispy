import type { Media } from '@/payload-types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

export type MediaImageVariant =
  | 'thumbnail'
  | 'square'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | 'og'
  | 'original'

type MediaResource = Pick<
  Media,
  'url' | 'updatedAt' | 'width' | 'height' | 'sizes' | 'thumbnailURL'
>

const VARIANT_FALLBACKS: Record<MediaImageVariant, Array<MediaImageVariant | 'original'>> = {
  thumbnail: ['thumbnail', 'square', 'small', 'medium', 'original'],
  square: ['square', 'thumbnail', 'small', 'medium', 'original'],
  small: ['small', 'thumbnail', 'medium', 'large', 'original'],
  medium: ['medium', 'small', 'large', 'xlarge', 'original'],
  large: ['large', 'xlarge', 'medium', 'original'],
  xlarge: ['xlarge', 'large', 'medium', 'original'],
  og: ['og', 'large', 'xlarge', 'medium', 'original'],
  original: ['original'],
}

function isAbsoluteHttpUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://')
}

function isPayloadMediaProxy(url: string): boolean {
  return url.includes('/api/media/file')
}

function pickSizedUrl(
  sizes: NonNullable<Media['sizes']> | null | undefined,
  variant: MediaImageVariant,
): { url: string; width?: number | null; height?: number | null } | null {
  if (!sizes || variant === 'original') return null

  for (const key of VARIANT_FALLBACKS[variant]) {
    if (key === 'original') continue
    const entry = sizes[key as keyof NonNullable<Media['sizes']>]
    if (typeof entry?.url === 'string' && entry.url && !isPayloadMediaProxy(entry.url)) {
      return { url: entry.url, width: entry.width, height: entry.height }
    }
  }
  return null
}

/**
 * Prefer persisted absolute `sizes.*` (OSS). Skip Payload proxy URLs that overwrite DB.
 * Fall back to thumbnailURL when sizes were regenerated as `/api/media/file/...`.
 */
export function resolveMediaImageSrc(
  resource: MediaResource,
  options?: { variant?: MediaImageVariant },
): {
  src: string
  width?: number | null
  height?: number | null
  unoptimized: boolean
} {
  const variant = options?.variant ?? 'medium'
  const sized = pickSizedUrl(resource.sizes, variant)

  let rawUrl = ''
  if (variant === 'original') {
    rawUrl = resource.url ?? ''
  } else if (sized?.url) {
    rawUrl = sized.url
  } else if (
    typeof resource.thumbnailURL === 'string' &&
    isAbsoluteHttpUrl(resource.thumbnailURL)
  ) {
    rawUrl = resource.thumbnailURL
  } else {
    rawUrl = resource.url ?? ''
  }

  const src = getMediaUrl(rawUrl, resource.updatedAt)
  const unoptimized = isAbsoluteHttpUrl(src) || isPayloadMediaProxy(src)

  return {
    src,
    width: sized?.width ?? resource.width,
    height: sized?.height ?? resource.height,
    unoptimized,
  }
}
