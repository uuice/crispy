import { describe, expect, it } from 'vitest'

import { buildOssDatePrefix } from '@/uploads/ossDatePrefix'
import { buildOssObjectKey, buildOssPublicUrl } from '@/uploads/ossObjectKey'

describe('ossObjectKey', () => {
  it('builds date-based composite object keys', () => {
    const prev = process.env.S3_PREFIX
    process.env.S3_PREFIX = 'media'

    expect(
      buildOssObjectKey({
        docPrefix: '2026/07/08',
        filename: 'photo.jpg',
      }),
    ).toBe('media/2026/07/08/photo.jpg')

    process.env.S3_PREFIX = prev
  })

  it('falls back to collection prefix for legacy rows', () => {
    const prev = process.env.S3_PREFIX
    process.env.S3_PREFIX = 'media'

    expect(
      buildOssObjectKey({
        docPrefix: 'media',
        filename: 'photo.jpg',
      }),
    ).toBe('media/photo.jpg')

    process.env.S3_PREFIX = prev
  })

  it('builds public URLs with encoded filenames', () => {
    const prev = process.env.S3_PREFIX
    process.env.S3_PREFIX = 'media'

    expect(
      buildOssPublicUrl({
        docPrefix: '2026/07/08',
        filename: 'my photo.jpg',
        publicBaseUrl: 'https://bucket.oss-cn-hangzhou.aliyuncs.com',
      }),
    ).toBe('https://bucket.oss-cn-hangzhou.aliyuncs.com/media/2026/07/08/my%20photo.jpg')

    process.env.S3_PREFIX = prev
  })
})

describe('ossDatePrefix', () => {
  it('formats YYYY/MM/DD from a date', () => {
    expect(buildOssDatePrefix(new Date(2026, 6, 8))).toBe('2026/07/08')
  })
})
