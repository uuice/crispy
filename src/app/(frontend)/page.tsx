import { generatePageMetadata, renderPage } from '@/frontend/render'

export const revalidate = false

export default function HomePage() {
  return renderPage('home')
}

export function generateMetadata() {
  return generatePageMetadata('home')
}
