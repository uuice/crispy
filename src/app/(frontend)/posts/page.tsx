import { generateThemeMetadata, renderThemePage } from '@/themes/render'

export const revalidate = false

export default function PostsPage() {
  return renderThemePage('posts')
}

export function generateMetadata() {
  return generateThemeMetadata('posts')
}
