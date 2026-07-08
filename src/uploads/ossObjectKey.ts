import path from 'path'

function collectionPrefix(): string {
  return (process.env.S3_PREFIX ?? 'media').replace(/^\/+|\/+$/g, '')
}

/** Build the OSS object key for a media file (matches Payload S3 adapter, non-composite mode). */
export function buildOssObjectKey(input: {
  docPrefix?: string | null
  filename: string
}): string {
  const collection = collectionPrefix()
  const docPrefix = (input.docPrefix ?? '').replace(/^\/+|\/+$/g, '')
  const filename = input.filename

  if (!docPrefix || docPrefix === collection) {
    return path.posix.join(collection, filename)
  }

  // Interim rows: date-only prefix from the composite-prefix era (`2026/07/08`).
  if (/^\d{4}\/\d{2}\/\d{2}$/.test(docPrefix)) {
    return path.posix.join(collection, docPrefix, filename)
  }

  // Full upload prefix (`crispy/2026/07/08`) is used as-is.
  return path.posix.join(docPrefix, filename)
}

/** Encode filename segment the same way as @payloadcms/storage-s3 generateURL. */
export function encodeOssObjectKey(fileKey: string): string {
  const dir = path.posix.dirname(fileKey)
  const encodedFilename = encodeURIComponent(path.posix.basename(fileKey))
  return dir === '.' ? encodedFilename : path.posix.join(dir, encodedFilename)
}

export function buildOssPublicUrl(input: {
  docPrefix?: string | null
  filename: string
  publicBaseUrl?: string | null
}): string | null {
  const publicBase = (input.publicBaseUrl ?? process.env.S3_PUBLIC_BASE_URL)?.replace(/\/$/, '')
  if (!publicBase) return null

  const fileKey = encodeOssObjectKey(buildOssObjectKey(input))
  return `${publicBase}/${fileKey}`
}

export function buildOssEndpointUrl(input: {
  docPrefix?: string | null
  filename: string
  endpoint?: string | null
  bucket?: string | null
}): string | null {
  const endpoint = (input.endpoint ?? process.env.S3_ENDPOINT)?.replace(/\/$/, '')
  const bucket = input.bucket ?? process.env.S3_BUCKET
  if (!endpoint || !bucket) return null

  const fileKey = encodeOssObjectKey(buildOssObjectKey(input))
  return `${endpoint}/${bucket}/${fileKey}`
}
