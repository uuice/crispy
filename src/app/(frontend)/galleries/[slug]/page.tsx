import { generatePageMetadata, renderPage } from '@/frontend/render'
import type { SlugPageProps } from '@/frontend/types'

export const revalidate = false

type Args = SlugPageProps

export default function GalleryDetailPage({ params }: Args) {
  return renderPage('galleryDetail', { params })
}

export function generateMetadata({ params }: Args) {
  return generatePageMetadata('galleryDetail', { params })
}
