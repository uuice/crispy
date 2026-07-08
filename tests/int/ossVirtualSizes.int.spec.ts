import { describe, expect, it } from 'vitest'

import {
  appendAliyunOssProcess,
  buildAliyunOssProcess,
  buildVirtualMediaSizes,
  resolveMediaOriginalUrl,
} from '@/uploads/ossVirtualSizes'
import { MEDIA_IMAGE_SIZES } from '@/uploads/mediaImageSizes'

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
})
