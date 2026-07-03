import { generateThemeMetadata, renderThemePage } from '@/themes/render'

export const revalidate = false

export default function HomePage() {
  return renderThemePage('home')
}

export function generateMetadata() {
  return generateThemeMetadata('home')
}
