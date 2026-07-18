import type { CollectionAfterReadHook } from 'payload'

import { resolveStorageConfigSync } from '@/storage/resolveStorageConfig'
import {
  buildVirtualMediaSizes,
  resolveMediaOriginalUrl,
} from '@/uploads/ossVirtualSizes'

type SizeEntry = { url?: string | null } | null | undefined

type MediaDoc = {
  url?: string | null
  filename?: string | null
  prefix?: string | null
  mimeType?: string | null
  width?: number | null
  height?: number | null
  thumbnailURL?: string | null
  sizes?: Record<string, SizeEntry> | null
}

function isAbsoluteHttpUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://')
}

function stripOssProcess(url: string): string {
  try {
    const parsed = new URL(url)
    parsed.searchParams.delete('x-oss-process')
    const query = parsed.searchParams.toString()
    return query ? `${parsed.origin}${parsed.pathname}?${query}` : `${parsed.origin}${parsed.pathname}`
  } catch {
    return url.split('?')[0] ?? url
  }
}

function hasAbsoluteOssSizeUrls(sizes: MediaDoc['sizes']): boolean {
  if (!sizes || typeof sizes !== 'object') return false
  return Object.values(sizes).some(
    (entry) => typeof entry?.url === 'string' && isAbsoluteHttpUrl(entry.url),
  )
}

function sizesLookLikePayloadProxy(sizes: MediaDoc['sizes']): boolean {
  if (!sizes || typeof sizes !== 'object') return true
  const urls = Object.values(sizes)
    .map((entry) => entry?.url)
    .filter((url): url is string => typeof url === 'string' && url.length > 0)
  if (urls.length === 0) return true
  return urls.every((url) => url.includes('/api/media/file'))
}

/**
 * Payload upload/S3 afterRead regenerates sizes.*.url as `/api/media/file/...`,
 * even when DB columns already store OSS process URLs.
 *
 * Restore absolute OSS size URLs for the frontend. Prefer thumbnailURL (often still
 * the persisted OSS value) so this works even when storage-runtime.json is missing
 * on the app server.
 */
export const presentMediaOssUrlsAfterRead: CollectionAfterReadHook = ({ doc }) => {
  const media = doc as MediaDoc
  const mimeType = typeof media.mimeType === 'string' ? media.mimeType : ''
  if (mimeType && !mimeType.startsWith('image/')) return doc

  // Already good (e.g. local with working rewrite).
  if (hasAbsoluteOssSizeUrls(media.sizes) && !sizesLookLikePayloadProxy(media.sizes)) {
    const firstAbsolute = Object.values(media.sizes ?? {}).find(
      (entry) => typeof entry?.url === 'string' && isAbsoluteHttpUrl(entry.url),
    )?.url
    if (typeof media.url === 'string' && media.url.includes('/api/media/file') && firstAbsolute) {
      return { ...doc, url: stripOssProcess(firstAbsolute) }
    }
    return doc
  }

  const filename = typeof media.filename === 'string' ? media.filename : null
  const prefix = typeof media.prefix === 'string' ? media.prefix : null
  const width = media.width
  const height = media.height

  // Path A: rebuild from persisted thumbnailURL (works without storage-runtime.json).
  const thumb = typeof media.thumbnailURL === 'string' ? media.thumbnailURL : ''
  if (isAbsoluteHttpUrl(thumb)) {
    const originalUrl = stripOssProcess(thumb)
    const sizes = buildVirtualMediaSizes({
      url: originalUrl,
      filename,
      prefix,
      mimeType: mimeType || 'image/jpeg',
      width,
      height,
    })
    if (sizes) {
      return {
        ...doc,
        url: originalUrl,
        thumbnailURL: sizes.thumbnail?.url ?? thumb,
        sizes,
      }
    }
  }

  // Path B: storage-runtime / publicBaseUrl available.
  const storage = resolveStorageConfigSync()
  if (!storage.enabled) return doc

  const url = typeof media.url === 'string' ? media.url : ''
  if (!url) return doc

  const originalUrl = resolveMediaOriginalUrl({ url, filename, prefix })
  if (!originalUrl) return doc

  if (!storage.virtualSizes) {
    return originalUrl === url ? doc : { ...doc, url: originalUrl }
  }

  const sizes = buildVirtualMediaSizes({
    url,
    filename,
    prefix,
    mimeType: mimeType || 'image/jpeg',
    width,
    height,
  })
  if (!sizes) {
    return originalUrl === url ? doc : { ...doc, url: originalUrl }
  }

  return {
    ...doc,
    url: originalUrl,
    thumbnailURL: sizes.thumbnail?.url ?? media.thumbnailURL,
    sizes,
  }
}
