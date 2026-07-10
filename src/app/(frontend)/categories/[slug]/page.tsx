import { generateThemeMetadata, generateThemeStaticParams, renderThemePage } from '@/themes/render'
import type { SlugPageProps } from '@/themes/types'

export const revalidate = false

type Args = SlugPageProps

export default function CategoryPage({ params, searchParams }: Args) {
  return renderThemePage('categoryDetail', { params, searchParams })
}

export function generateMetadata({ params, searchParams }: Args) {
  return generateThemeMetadata('categoryDetail', { params, searchParams })
}

export function generateStaticParams() {
  return generateThemeStaticParams('categoryDetail')
}
