import { generateThemeMetadata, generateThemeStaticParams, renderThemePage } from '@/themes/render'
import type { SlugPageProps } from '@/themes/types'

export const revalidate = false

type Args = SlugPageProps

export default function NovelDetailPage({ params }: Args) {
  return renderThemePage('novelDetail', { params })
}

export function generateMetadata({ params }: Args) {
  return generateThemeMetadata('novelDetail', { params })
}

export function generateStaticParams() {
  return generateThemeStaticParams('novelDetail')
}
