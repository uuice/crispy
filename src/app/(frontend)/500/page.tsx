import { generatePageMetadata, renderPage } from '@/frontend/render'

export const revalidate = false

export default function ServerErrorPage() {
  return renderPage('serverError')
}

export function generateMetadata() {
  return generatePageMetadata('serverError')
}
