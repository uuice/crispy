import { generatePageMetadata, renderPage } from '@/frontend/render'

export const revalidate = false

type Args = {
  params: Promise<{ slug: string }>
}

export default function PostPage({ params }: Args) {
  return renderPage('postDetail', { params })
}

export function generateMetadata({ params }: Args) {
  return generatePageMetadata('postDetail', { params })
}
