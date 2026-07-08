import type { Plugin } from 'payload'
import { s3Storage } from '@payloadcms/storage-s3'

function isS3Enabled(): boolean {
  return Boolean(
    process.env.S3_BUCKET &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY,
  )
}

export function createS3StoragePlugin(): Plugin | null {
  if (!isS3Enabled()) {
    return null
  }

  const region = process.env.S3_REGION ?? 'us-east-1'
  const endpoint = process.env.S3_ENDPOINT

  return s3Storage({
    enabled: true,
    collections: {
      media: {
        prefix: process.env.S3_PREFIX ?? 'media',
      },
    },
    bucket: process.env.S3_BUCKET!,
    config: {
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
      region,
      ...(endpoint
        ? {
            endpoint,
            forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== 'false',
          }
        : {}),
    },
  })
}

export { isS3Enabled }
