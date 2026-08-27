import { generatePageMetadata, renderPage } from '@/frontend/render'

export const revalidate = false

export default function JobsPage() {
  return renderPage('jobs')
}

export function generateMetadata() {
  return generatePageMetadata('jobs')
}
