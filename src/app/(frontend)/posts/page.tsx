import { generateThemeMetadata, renderThemePage } from '@/themes/render'
import type { ThemeListPageProps } from '@/themes/types'

export const revalidate = false

type Args = ThemeListPageProps

export default function PostsPage({ searchParams }: Args) {
  return renderThemePage('posts', { searchParams })
}

export function generateMetadata({ searchParams }: Args) {
  return generateThemeMetadata('posts', { searchParams })
}
