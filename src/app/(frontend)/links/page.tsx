import { generateThemeMetadata, renderThemePage } from '@/themes/render'

export const revalidate = false

export default function LinksPage() {
  return renderThemePage('links')
}

export function generateMetadata() {
  return generateThemeMetadata('links')
}
