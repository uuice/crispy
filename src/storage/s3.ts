import type { Plugin } from 'payload'
import { s3Storage } from '@payloadcms/storage-s3'

import { resolveStorageConfigSync } from '@/storage/resolveStorageConfig'

export function isS3Enabled(): boolean {
  return resolveStorageConfigSync().enabled
}

/**
 * Always register the S3 storage plugin so `media.prefix` exists in the DB schema.
 * When S3 is off (or CRISPY_DISABLE_S3=true), use enabled:false + alwaysInsertFields
 * so push/import still creates `prefix` without uploading to OSS.
 */
export function createS3StoragePlugin(): Plugin {
  const config = resolveStorageConfigSync()

  if (!config.enabled) {
    return s3Storage({
      enabled: false,
      alwaysInsertFields: true,
      collections: {
        media: {
          prefix: config.prefix || 'media',
        },
      },
      bucket: 'unused',
      config: {},
    })
  }

  return s3Storage({
    enabled: true,
    alwaysInsertFields: true,
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
