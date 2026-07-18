import { generateThemeMetadata, renderThemePage } from '@/themes/render'

export const revalidate = false

export default function GalleriesPage() {
  return renderThemePage('galleries')
}

export function generateMetadata() {
  return generateThemeMetadata('galleries')
}
