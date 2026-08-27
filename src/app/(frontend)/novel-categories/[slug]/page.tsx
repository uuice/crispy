import { generatePageMetadata, renderPage } from '@/frontend/render'
import type { SlugPageProps } from '@/frontend/types'

export const revalidate = false

type Args = SlugPageProps

export default function NovelCategoryPage({ params, searchParams }: Args) {
  return renderPage('novelCategoryDetail', { params, searchParams })
}

export function generateMetadata({ params, searchParams }: Args) {
  return generatePageMetadata('novelCategoryDetail', { params, searchParams })
}
