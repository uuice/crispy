import { generateThemeMetadata, renderThemePage } from '@/themes/render'

export const revalidate = false

export default function NovelsPage() {
  return renderThemePage('novels')
}

export function generateMetadata() {
  return generateThemeMetadata('novels')
}
