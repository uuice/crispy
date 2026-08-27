import { generatePageMetadata, renderPage } from '@/frontend/render'
import type { SlugPageProps } from '@/frontend/types'

export const revalidate = false

type Args = SlugPageProps

export default function TagPage({ params, searchParams }: Args) {
  return renderPage('tagDetail', { params, searchParams })
}

export function generateMetadata({ params, searchParams }: Args) {
  return generatePageMetadata('tagDetail', { params, searchParams })
}
