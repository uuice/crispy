import { generateThemeMetadata, renderThemePage } from '@/themes/render'

export const revalidate = false

export default function ServerErrorPage() {
  return renderThemePage('serverError')
}

export function generateMetadata() {
  return generateThemeMetadata('serverError')
}
