import { generateThemeMetadata, renderThemePage } from '@/themes/render'

export const revalidate = false

export default function MathGamePage() {
  return renderThemePage('gamesMath')
}

export function generateMetadata() {
  return generateThemeMetadata('gamesMath')
}
