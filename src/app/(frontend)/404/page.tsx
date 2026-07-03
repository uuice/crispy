import { generateThemeMetadata, renderThemePage } from '@/themes/render'

export const revalidate = false

export default function NotFoundPage() {
  return renderThemePage('notFound')
}

export function generateMetadata() {
  return generateThemeMetadata('notFound')
}
