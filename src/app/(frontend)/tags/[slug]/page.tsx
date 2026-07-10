import { generateThemeMetadata, generateThemeStaticParams, renderThemePage } from '@/themes/render'
import type { SlugPageProps } from '@/themes/types'

export const revalidate = false

type Args = SlugPageProps

export default function TagPage({ params, searchParams }: Args) {
  return renderThemePage('tagDetail', { params, searchParams })
}

export function generateMetadata({ params, searchParams }: Args) {
  return generateThemeMetadata('tagDetail', { params, searchParams })
}

export function generateStaticParams() {
  return generateThemeStaticParams('tagDetail')
}
