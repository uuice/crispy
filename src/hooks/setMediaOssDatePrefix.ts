import type { CollectionBeforeChangeHook } from 'payload'

import { buildOssDatePrefix } from '@/uploads/ossDatePrefix'
import { isS3Enabled } from '@/storage/s3'

type MediaData = {
  filename?: string | null
  prefix?: string | null
}

/** Set per-upload date prefix so OSS keys become `{S3_PREFIX}/{YYYY}/{MM}/{DD}/{filename}`. */
export const setMediaOssDatePrefix: CollectionBeforeChangeHook<MediaData> = async ({
  data,
  operation,
  originalDoc,
}) => {
  if (!isS3Enabled()) return data

  const incoming = data as MediaData
  const isNewUpload =
    operation === 'create' ||
    (typeof incoming.filename === 'string' &&
      incoming.filename !== '' &&
      incoming.filename !== originalDoc?.filename)

  if (!isNewUpload) {
    return data
  }

  return {
    ...incoming,
    prefix: buildOssDatePrefix(),
  }
}
