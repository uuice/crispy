import { generatePageMetadata, renderPage } from '@/frontend/render'
import type { SlugPageProps } from '@/frontend/types'

export const revalidate = false

type Args = SlugPageProps

export default function NovelTagPage({ params, searchParams }: Args) {
  return renderPage('novelTagDetail', { params, searchParams })
}

export function generateMetadata({ params, searchParams }: Args) {
  return generatePageMetadata('novelTagDetail', { params, searchParams })
}
