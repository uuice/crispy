import { generatePageMetadata, renderPage } from '@/frontend/render'
import type { ListPageProps } from '@/frontend/types'

export const revalidate = false

type Args = ListPageProps

export default function PostsPage({ searchParams }: Args) {
  return renderPage('posts', { searchParams })
}

export function generateMetadata({ searchParams }: Args) {
  return generatePageMetadata('posts', { searchParams })
}
