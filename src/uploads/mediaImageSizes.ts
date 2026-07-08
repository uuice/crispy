/** Image variant definitions shared by Sharp uploads and OSS virtual sizes. */
export type MediaImageSize = {
  name: string
  width?: number
  height?: number
  crop?: string
}

export const MEDIA_IMAGE_SIZES: MediaImageSize[] = [
  { name: 'thumbnail', width: 300 },
  { name: 'square', width: 500, height: 500, crop: 'center' },
  { name: 'small', width: 600 },
  { name: 'medium', width: 900 },
  { name: 'large', width: 1400 },
  { name: 'xlarge', width: 1920 },
  { name: 'og', width: 1200, height: 630, crop: 'center' },
]
