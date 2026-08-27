import { generatePageMetadata, renderPage } from '@/frontend/render'

export const revalidate = false

export default function NovelsPage() {
  return renderPage('novels')
}

export function generateMetadata() {
  return generatePageMetadata('novels')
}
