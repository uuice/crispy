import { resolveStorageConfigSync } from '@/storage/resolveStorageConfig'

/** OSS virtual sizes replace Sharp when S3 storage is enabled (Admin storage-targets.virtualSizes). */
export function isOssVirtualSizesEnabled(): boolean {
  const config = resolveStorageConfigSync()
  return config.enabled && config.virtualSizes
}
