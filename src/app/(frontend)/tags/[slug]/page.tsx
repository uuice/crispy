import { generateThemeMetadata, generateThemeStaticParams, renderThemePage } from '@/themes/render'

export const revalidate = false

type Args = {
  params: Promise<{ slug: string }>
}

export default function TagPage({ params }: Args) {
  return renderThemePage('tagDetail', { params })
}

export function generateMetadata({ params }: Args) {
  return generateThemeMetadata('tagDetail', { params })
}

export function generateStaticParams() {
  return generateThemeStaticParams('tagDetail')
}
