import { generateThemeMetadata, renderThemePage } from '@/themes/render'

export const revalidate = false

export default function NavigationsPage() {
  return renderThemePage('navigations')
}

export function generateMetadata() {
  return generateThemeMetadata('navigations')
}
