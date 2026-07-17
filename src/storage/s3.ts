import type { Plugin } from 'payload'
import { s3Storage } from '@payloadcms/storage-s3'

import { resolveStorageConfigSync } from '@/storage/resolveStorageConfig'

export function isS3Enabled(): boolean {
  return resolveStorageConfigSync().enabled
}

export function createS3StoragePlugin(): Plugin | null {
  const config = resolveStorageConfigSync()
  if (!config.enabled) {
    return null
  }

  return s3Storage({
    enabled: true,
    collections: {
      media: {
        prefix: config.prefix,
      },
    },
    bucket: config.bucket,
    config: {
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      region: config.region,
      ...(config.endpoint
        ? {
            endpoint: config.endpoint,
            forcePathStyle: config.forcePathStyle,
          }
        : {}),
    },
  })
}
