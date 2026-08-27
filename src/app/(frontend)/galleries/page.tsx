import { generatePageMetadata, renderPage } from '@/frontend/render'

export const revalidate = false

export default function GalleriesPage() {
  return renderPage('galleries')
}

export function generateMetadata() {
  return generatePageMetadata('galleries')
}
