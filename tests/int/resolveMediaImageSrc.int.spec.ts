import { describe, expect, it } from 'vitest'

import { resolveMediaImageSrc } from '@/utilities/resolveMediaImageSrc'
import { getMediaUrl } from '@/utilities/getMediaUrl'

describe('resolveMediaImageSrc', () => {
  it('prefers persisted small size and skips Next optimizer for OSS URLs', () => {
    const resolved = resolveMediaImageSrc(
      {
        url: '/api/media/file/27.jpg',
        width: 4000,
        height: 3000,
        updatedAt: '2026-07-08T06:33:30.447Z',
        sizes: {
          small: {
            url: 'https://uuice.oss-cn-shanghai.aliyuncs.com/crispy/2026/07/08/27.jpg?x-oss-process=image/resize,w_600',
            width: 600,
            height: 450,
          },
          large: {
            url: 'https://uuice.oss-cn-shanghai.aliyuncs.com/crispy/2026/07/08/27.jpg?x-oss-process=image/resize,w_1400',
            width: 1400,
            height: 1050,
          },
        },
      },
      { variant: 'small' },
    )

    expect(resolved.src).toContain('w_600')
    expect(resolved.src).not.toContain('/api/media/file')
    expect(resolved.unoptimized).toBe(true)
  })

  it('skips Payload proxy size URLs and falls back to thumbnailURL', () => {
    const resolved = resolveMediaImageSrc(
      {
        url: '/api/media/file/27.jpg',
        thumbnailURL:
          'https://uuice.oss-cn-shanghai.aliyuncs.com/crispy/2026/07/08/27.jpg?x-oss-process=image/resize,w_300',
        updatedAt: '2026-07-08T06:33:30.447Z',
        sizes: {
          small: { url: '/api/media/file/27.jpg', width: 600, height: 338 },
        },
      },
      { variant: 'small' },
    )
    expect(resolved.src).toContain('aliyuncs.com')
    expect(resolved.src).toContain('w_300')
    expect(resolved.unoptimized).toBe(true)
  })

  it('skips Next optimizer for Payload media proxy fallbacks', () => {
    const resolved = resolveMediaImageSrc(
      {
        url: '/api/media/file/missing-sizes.jpg',
        updatedAt: '2026-07-08T06:33:30.447Z',
      },
      { variant: 'medium' },
    )
    expect(resolved.src.startsWith('/api/media/file')).toBe(true)
    expect(resolved.unoptimized).toBe(true)
  })

  it('appends cache busting without breaking existing query params', () => {
    const url = getMediaUrl(
      'https://cdn.example.com/a.jpg?x-oss-process=image/resize,w_300',
      '2026-07-08T06:33:30.447Z',
    )
    expect(url).toContain('x-oss-process=image/resize,w_300')
    expect(url).toContain('&v=')
  })
})
