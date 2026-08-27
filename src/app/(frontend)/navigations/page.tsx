import { generatePageMetadata, renderPage } from '@/frontend/render'

export const revalidate = false

export default function NavigationsPage() {
  return renderPage('navigations')
}

export function generateMetadata() {
  return generatePageMetadata('navigations')
}
