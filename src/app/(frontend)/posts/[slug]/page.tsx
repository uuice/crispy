import { generateThemeMetadata, generateThemeStaticParams, renderThemePage } from '@/themes/render'

export const revalidate = false

type Args = {
  params: Promise<{ slug: string }>
}

export default function PostPage({ params }: Args) {
  return renderThemePage('postDetail', { params })
}

export function generateMetadata({ params }: Args) {
  return generateThemeMetadata('postDetail', { params })
}

export function generateStaticParams() {
  return generateThemeStaticParams('postDetail')
}
