import { generatePageMetadata, renderPage } from '@/frontend/render'
import type { NovelChapterPageProps } from '@/frontend/types'

export const revalidate = false

type Args = NovelChapterPageProps

export default function NovelChapterPage({ params }: Args) {
  return renderPage('novelChapter', { params })
}

export function generateMetadata({ params }: Args) {
  return generatePageMetadata('novelChapter', { params })
}
