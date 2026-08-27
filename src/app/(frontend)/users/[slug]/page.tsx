import { generatePageMetadata, renderPage } from '@/frontend/render'
import type { SlugPageProps } from '@/frontend/types'

export const revalidate = false

type Args = SlugPageProps

export default function UserPage({ params, searchParams }: Args) {
  return renderPage('userDetail', { params, searchParams })
}

export function generateMetadata({ params, searchParams }: Args) {
  return generatePageMetadata('userDetail', { params, searchParams })
}
