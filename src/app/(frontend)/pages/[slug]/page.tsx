import { generateThemeMetadata, generateThemeStaticParams, renderThemePage } from '@/themes/render'

export const revalidate = false

type Args = {
  params: Promise<{ slug: string }>
}

export default function CmsPage({ params }: Args) {
  return renderThemePage('pageDetail', { params })
}

export function generateMetadata({ params }: Args) {
  return generateThemeMetadata('pageDetail', { params })
}

export function generateStaticParams() {
  return generateThemeStaticParams('pageDetail')
}
