import { generateThemeMetadata, generateThemeStaticParams, renderThemePage } from '@/themes/render'
import type { SlugPageProps } from '@/themes/types'

export const revalidate = false

type Args = SlugPageProps

export default function NovelCategoryPage({ params, searchParams }: Args) {
  return renderThemePage('novelCategoryDetail', { params, searchParams })
}

export function generateMetadata({ params, searchParams }: Args) {
  return generateThemeMetadata('novelCategoryDetail', { params, searchParams })
}

export function generateStaticParams() {
  return generateThemeStaticParams('novelCategoryDetail')
}
