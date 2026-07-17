import { resolveStorageConfigSync } from '@/storage/resolveStorageConfig'

/** Date segment for OSS object keys (e.g. `2026/07/08`). */
export function buildOssDatePrefix(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}

/** Full document prefix stored in media.prefix (e.g. `crispy/2026/07/08`). */
export function buildOssUploadPrefix(date: Date = new Date()): string {
  const collection = resolveStorageConfigSync().prefix.replace(/^\/+|\/+$/g, '') || 'media'
  return `${collection}/${buildOssDatePrefix(date)}`
}
