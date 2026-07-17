import fs from 'fs'
import os from 'os'
import path from 'path'

import { afterEach, describe, expect, it } from 'vitest'

import {
  appendAliyunOssProcess,
  buildAliyunOssProcess,
  buildVirtualMediaSizes,
  resolveMediaOriginalUrl,
} from '@/uploads/ossVirtualSizes'
import { MEDIA_IMAGE_SIZES } from '@/uploads/mediaImageSizes'
import { resolveAdminMediaThumbnailUrl } from '@/uploads/resolveAdminMediaThumbnailUrl'

function writeTestStorageRuntime(config: Record<string, unknown>): string {
  const filePath = path.join(os.tmpdir(), `crispy-storage-runtime-${process.pid}-${Date.now()}.json`)
  fs.writeFileSync(filePath, `${JSON.stringify(config, null, 2)}\n`, 'utf8')
  process.env.CRISPY_STORAGE_RUNTIME_PATH = filePath
  return filePath
}

describe('ossVirtualSizes', () => {
  const runtimeFiles: string[] = []

  afterEach(() => {
    delete process.env.CRISPY_STORAGE_RUNTIME_PATH
    for (const file of runtimeFiles.splice(0)) {
      try {
        fs.unlinkSync(file)
      } catch {
        // ignore
      }
    }
  })

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

  it('resolves relative media paths from storage runtime file', () => {
    runtimeFiles.push(
      writeTestStorageRuntime({
        mode: 's3',
        bucket: 'my-bucket',
        region: 'oss-cn-hangzhou',
        endpoint: 'https://oss-cn-hangzhou.aliyuncs.com',
        prefix: 'media',
        accessKeyId: 'key',
        secretAccessKey: 'secret',
        forcePathStyle: false,
        virtualSizes: true,
      }),
    )

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
    runtimeFiles.push(
      writeTestStorageRuntime({
        mode: 's3',
        bucket: 'my-bucket',
        region: 'oss-cn-hangzhou',
        endpoint: 'https://oss-cn-hangzhou.aliyuncs.com',
        prefix: 'media',
        accessKeyId: 'key',
        secretAccessKey: 'secret',
        forcePathStyle: false,
        publicBaseUrl: 'https://bucket.oss-cn-hangzhou.aliyuncs.com',
        virtualSizes: true,
      }),
    )

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
  })
})
