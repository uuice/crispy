import { generatePageMetadata, renderPage } from '@/frontend/render'

export const revalidate = false

export default function NotFoundPage() {
  return renderPage('notFound')
}

export function generateMetadata() {
  return generatePageMetadata('notFound')
}
