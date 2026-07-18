import type { FieldHook } from 'payload'

/** Default gallery-item title from linked media alt/filename when empty. */
export const fillGalleryItemTitleFromMedia: FieldHook = async ({ value, data, req, siblingData }) => {
  if (typeof value === 'string' && value.trim()) return value

  const imageRef = siblingData?.image ?? data?.image
  const imageId =
    typeof imageRef === 'object' && imageRef && 'id' in imageRef
      ? (imageRef as { id: string | number }).id
      : imageRef

  if (imageId == null || imageId === '') return value || '未命名图片'

  try {
    const media = await req.payload.findByID({
      collection: 'media',
      id: imageId as string | number,
      depth: 0,
      overrideAccess: true,
      req,
    })
    const alt = typeof media.alt === 'string' ? media.alt.trim() : ''
    if (alt) return alt
    const filename = typeof media.filename === 'string' ? media.filename.trim() : ''
    if (filename) return filename.replace(/\.[^.]+$/, '') || filename
  } catch {
    // fall through
  }

  return value || `图片 ${imageId}`
}
