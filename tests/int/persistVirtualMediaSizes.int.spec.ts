import { describe, expect, it } from 'vitest'

import { buildVirtualMediaSizes } from '@/uploads/ossVirtualSizes'
import { buildVirtualMediaSizesSqlSets } from '@/uploads/persistVirtualMediaSizes'
import { MEDIA_IMAGE_SIZES } from '@/uploads/mediaImageSizes'

describe('persistVirtualMediaSizes', () => {
  it('builds SQL sets for thumbnail and every configured size', () => {
    const sizes = buildVirtualMediaSizes({
      url: 'https://bucket.oss-cn-hangzhou.aliyuncs.com/media/photo.jpg',
      filename: 'photo.jpg',
      mimeType: 'image/jpeg',
      width: 1920,
      height: 1080,
      sizes: MEDIA_IMAGE_SIZES,
    })

    expect(sizes).toBeTruthy()

    const sets = buildVirtualMediaSizesSqlSets(sizes!, sizes!.thumbnail?.url)
    // thumbnail_u_r_l + 6 fields per size (url, width, height, mime_type, filename)
    expect(sets).toHaveLength(1 + MEDIA_IMAGE_SIZES.length * 5)
  })
})
