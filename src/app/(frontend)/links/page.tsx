import { generatePageMetadata, renderPage } from '@/frontend/render'

export const revalidate = false

export default function LinksPage() {
  return renderPage('links')
}

export function generateMetadata() {
  return generatePageMetadata('links')
}
