import { generateThemeMetadata, renderThemePage } from '@/themes/render'

export const revalidate = false

export default function JobsPage() {
  return renderThemePage('jobs')
}

export function generateMetadata() {
  return generateThemeMetadata('jobs')
}
