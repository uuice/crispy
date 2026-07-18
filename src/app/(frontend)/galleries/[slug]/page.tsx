import { generateThemeMetadata, renderThemePage } from '@/themes/render'
import type { SlugPageProps } from '@/themes/types'

export const revalidate = false

type Args = SlugPageProps

export default function GalleryDetailPage({ params }: Args) {
  return renderThemePage('galleryDetail', { params })
}

export function generateMetadata({ params }: Args) {
  return generateThemeMetadata('galleryDetail', { params })
}
