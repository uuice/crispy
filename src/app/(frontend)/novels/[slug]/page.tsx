import { generatePageMetadata, renderPage } from '@/frontend/render'
import type { SlugPageProps } from '@/frontend/types'

export const revalidate = false

type Args = SlugPageProps

export default function NovelDetailPage({ params }: Args) {
  return renderPage('novelDetail', { params })
}

export function generateMetadata({ params }: Args) {
  return generatePageMetadata('novelDetail', { params })
}
