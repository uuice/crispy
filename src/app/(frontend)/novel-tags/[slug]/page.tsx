import { generateThemeMetadata, generateThemeStaticParams, renderThemePage } from '@/themes/render'
import type { SlugPageProps } from '@/themes/types'

export const revalidate = false

type Args = SlugPageProps

export default function NovelTagPage({ params, searchParams }: Args) {
  return renderThemePage('novelTagDetail', { params, searchParams })
}

export function generateMetadata({ params, searchParams }: Args) {
  return generateThemeMetadata('novelTagDetail', { params, searchParams })
}

export function generateStaticParams() {
  return generateThemeStaticParams('novelTagDetail')
}
