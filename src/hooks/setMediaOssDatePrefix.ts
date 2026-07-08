import type { CollectionBeforeChangeHook } from 'payload'

import { buildOssUploadPrefix } from '@/uploads/ossDatePrefix'
import { isS3Enabled } from '@/storage/s3'

/** Set per-upload date prefix so OSS keys become `{S3_PREFIX}/{YYYY}/{MM}/{DD}/{filename}`. */
export const setMediaOssDatePrefix: CollectionBeforeChangeHook = async ({
  data,
  operation,
  originalDoc,
}) => {
  if (!isS3Enabled()) return data

  const incoming = data as { filename?: string | null; prefix?: string | null }
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
    prefix: buildOssUploadPrefix(),
  }
}
