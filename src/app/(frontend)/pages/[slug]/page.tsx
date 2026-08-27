import { generatePageMetadata, renderPage } from '@/frontend/render'

export const revalidate = false

type Args = {
  params: Promise<{ slug: string }>
}

export default function CmsPage({ params }: Args) {
  return renderPage('pageDetail', { params })
}

export function generateMetadata({ params }: Args) {
  return generatePageMetadata('pageDetail', { params })
}
