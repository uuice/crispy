import { generateThemeMetadata, renderThemePage } from '@/themes/render'

export const revalidate = false

export default function GalleryItemsPage() {
  return renderThemePage('galleryItems')
}

export function generateMetadata() {
  return generateThemeMetadata('galleryItems')
}
