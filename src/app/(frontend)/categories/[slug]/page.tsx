import { generateThemeMetadata, generateThemeStaticParams, renderThemePage } from '@/themes/render'

export const revalidate = false

type Args = {
  params: Promise<{ slug: string }>
}

export default function CategoryPage({ params }: Args) {
  return renderThemePage('categoryDetail', { params })
}

export function generateMetadata({ params }: Args) {
  return generateThemeMetadata('categoryDetail', { params })
}

export function generateStaticParams() {
  return generateThemeStaticParams('categoryDetail')
}
