import { isS3Enabled } from '@/storage/s3'

/** OSS virtual sizes replace Sharp when S3 storage is enabled. Set CRISPY_OSS_VIRTUAL_SIZES=false to disable. */
export function isOssVirtualSizesEnabled(): boolean {
  if (!isS3Enabled()) return false
  return process.env.CRISPY_OSS_VIRTUAL_SIZES !== 'false'
}
