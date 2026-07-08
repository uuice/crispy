import { describe, expect, it } from 'vitest'

import {
  appendAliyunOssProcess,
  buildAliyunOssProcess,
  buildVirtualMediaSizes,
  resolveMediaOriginalUrl,
} from '@/uploads/ossVirtualSizes'
import { MEDIA_IMAGE_SIZES } from '@/uploads/mediaImageSizes'
import { resolveAdminMediaThumbnailUrl } from '@/uploads/resolveAdminMediaThumbnailUrl'

describe('ossVirtualSizes', () => {
  it('builds Aliyun resize process for width-only sizes', () => {
    expect(buildAliyunOssProcess({ name: 'thumbnail', width: 300 })).toBe('image/resize,w_300')
  })

  it('builds Aliyun fill crop for fixed aspect sizes', () => {
    expect(buildAliyunOssProcess({ name: 'og', width: 1200, height: 630, crop: 'center' })).toBe(
      'image/resize,m_fill,w_1200,h_630',
    )
  })

  it('appends x-oss-process to an absolute OSS URL', () => {
    const url = appendAliyunOssProcess(
      'https://bucket.oss-cn-hangzhou.aliyuncs.com/media/photo.jpg',
      'image/resize,w_300',
    )
    expect(url).toContain('x-oss-process=image%2Fresize%2Cw_300')
  })

  it('resolves relative media paths from S3 env', () => {
    const prev = {
      endpoint: process.env.S3_ENDPOINT,
      bucket: process.env.S3_BUCKET,
      prefix: process.env.S3_PREFIX,
      publicBase: process.env.S3_PUBLIC_BASE_URL,
    }

    process.env.S3_ENDPOINT = 'https://oss-cn-hangzhou.aliyuncs.com'
    process.env.S3_BUCKET = 'my-bucket'
    process.env.S3_PREFIX = 'media'
    delete process.env.S3_PUBLIC_BASE_URL

    expect(
      resolveMediaOriginalUrl({
        url: '/api/media/file/photo.jpg',
        filename: 'photo.jpg',
      }),
    ).toBe('https://oss-cn-hangzhou.aliyuncs.com/my-bucket/media/photo.jpg')

    expect(
      resolveMediaOriginalUrl({
        url: '/api/media/file/photo.jpg',
        filename: 'photo.jpg',
        prefix: '2026/07/08',
      }),
    ).toBe('https://oss-cn-hangzhou.aliyuncs.com/my-bucket/media/2026/07/08/photo.jpg')

    process.env.S3_ENDPOINT = prev.endpoint
    process.env.S3_BUCKET = prev.bucket
    process.env.S3_PREFIX = prev.prefix
    if (prev.publicBase) {
      process.env.S3_PUBLIC_BASE_URL = prev.publicBase
    } else {
      delete process.env.S3_PUBLIC_BASE_URL
    }
  })

  it('builds all configured virtual sizes', () => {
    const sizes = buildVirtualMediaSizes({
      url: 'https://bucket.oss-cn-hangzhou.aliyuncs.com/media/photo.jpg',
      filename: 'photo.jpg',
      mimeType: 'image/jpeg',
      width: 4000,
      height: 3000,
      sizes: MEDIA_IMAGE_SIZES,
    })

    expect(sizes?.thumbnail?.url).toContain('x-oss-process=')
    expect(sizes?.thumbnail?.url).toContain('w_300')
    expect(sizes?.og?.url).toContain('m_fill')
    expect(sizes?.og?.url).toContain('w_1200')
    expect(Object.keys(sizes ?? {})).toHaveLength(MEDIA_IMAGE_SIZES.length)
  })

  it('resolves admin thumbnail as direct OSS URL when S3 virtual sizes are enabled', () => {
    const prev = {
      bucket: process.env.S3_BUCKET,
      accessKey: process.env.S3_ACCESS_KEY_ID,
      secret: process.env.S3_SECRET_ACCESS_KEY,
      publicBase: process.env.S3_PUBLIC_BASE_URL,
      virtualSizes: process.env.CRISPY_OSS_VIRTUAL_SIZES,
    }

    process.env.S3_BUCKET = 'my-bucket'
    process.env.S3_ACCESS_KEY_ID = 'key'
    process.env.S3_SECRET_ACCESS_KEY = 'secret'
    process.env.S3_PUBLIC_BASE_URL = 'https://bucket.oss-cn-hangzhou.aliyuncs.com'
    delete process.env.CRISPY_OSS_VIRTUAL_SIZES

    const thumb = resolveAdminMediaThumbnailUrl({
      mimeType: 'image/jpeg',
      url: '/api/media/file/100.jpg',
      filename: '100.jpg',
      prefix: 'crispy/2026/07/08',
      width: 4000,
      height: 3000,
    })

    expect(thumb).toContain('https://bucket.oss-cn-hangzhou.aliyuncs.com/')
    expect(thumb).toContain('x-oss-process=')
    expect(thumb).toContain('w_300')
    expect(thumb).not.toContain('/api/media/file')

    process.env.S3_BUCKET = prev.bucket
    process.env.S3_ACCESS_KEY_ID = prev.accessKey
    process.env.S3_SECRET_ACCESS_KEY = prev.secret
    if (prev.publicBase) {
      process.env.S3_PUBLIC_BASE_URL = prev.publicBase
    } else {
      delete process.env.S3_PUBLIC_BASE_URL
    }
    if (prev.virtualSizes) {
      process.env.CRISPY_OSS_VIRTUAL_SIZES = prev.virtualSizes
    } else {
      delete process.env.CRISPY_OSS_VIRTUAL_SIZES
    }
  })
})
