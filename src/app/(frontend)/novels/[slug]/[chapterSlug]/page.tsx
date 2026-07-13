import { generateThemeMetadata, renderThemePage } from '@/themes/render'
import type { NovelChapterPageProps } from '@/themes/types'

export const revalidate = false

type Args = NovelChapterPageProps

export default function NovelChapterPage({ params }: Args) {
  return renderThemePage('novelChapter', { params })
}

export function generateMetadata({ params }: Args) {
  return generateThemeMetadata('novelChapter', { params })
}
