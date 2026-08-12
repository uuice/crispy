import { describe, expect, it, vi } from 'vitest'

import { buildOssDatePrefix } from '@/uploads/ossDatePrefix'
import { buildOssObjectKey, buildOssPublicUrl } from '@/uploads/ossObjectKey'

vi.mock('@/storage/resolveStorageConfig', () => ({
  resolveStorageConfigSync: () => ({
    enabled: false,
    mode: 'local',
    bucket: '',
    region: 'us-east-1',
    prefix: 'media',
    accessKeyId: '',
    secretAccessKey: '',
    forcePathStyle: true,
    virtualSizes: false,
    source: 'none',
  }),
}))

describe('ossObjectKey', () => {
  it('builds full upload prefix object keys', () => {
    expect(
      buildOssObjectKey({
        docPrefix: 'media/2026/07/08',
        filename: 'photo.jpg',
      }),
    ).toBe('media/2026/07/08/photo.jpg')
  })

  it('supports interim date-only prefix rows', () => {
    expect(
      buildOssObjectKey({
        docPrefix: '2026/07/08',
        filename: 'photo.jpg',
      }),
    ).toBe('media/2026/07/08/photo.jpg')
  })

  it('falls back to collection prefix for legacy rows', () => {
    expect(
      buildOssObjectKey({
        docPrefix: 'media',
        filename: 'photo.jpg',
      }),
    ).toBe('media/photo.jpg')
  })

  it('builds public URLs with encoded filenames', () => {
    expect(
      buildOssPublicUrl({
        docPrefix: 'media/2026/07/08',
        filename: 'my photo.jpg',
        publicBaseUrl: 'https://bucket.oss-cn-hangzhou.aliyuncs.com',
      }),
    ).toBe('https://bucket.oss-cn-hangzhou.aliyuncs.com/media/2026/07/08/my%20photo.jpg')
  })
})

describe('ossDatePrefix', () => {
  it('formats YYYY/MM/DD from a date', () => {
    expect(buildOssDatePrefix(new Date(2026, 6, 8))).toBe('2026/07/08')
  })
})
