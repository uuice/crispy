import { generateThemeMetadata, renderThemePage } from '@/themes/render'

export const revalidate = false

export default function GamesPage() {
  return renderThemePage('games')
}

export function generateMetadata() {
  return generateThemeMetadata('games')
}
