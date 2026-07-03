import { generateThemeMetadata, renderThemePage } from '@/themes/render'

export const revalidate = false

type Args = {
  params: Promise<{ slug: string }>
}

export default function UserPage({ params }: Args) {
  return renderThemePage('userDetail', { params })
}

export function generateMetadata({ params }: Args) {
  return generateThemeMetadata('userDetail', { params })
}
