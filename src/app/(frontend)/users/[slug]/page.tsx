import { generateThemeMetadata, renderThemePage } from '@/themes/render'
import type { SlugPageProps } from '@/themes/types'

export const revalidate = false

type Args = SlugPageProps

export default function UserPage({ params, searchParams }: Args) {
  return renderThemePage('userDetail', { params, searchParams })
}

export function generateMetadata({ params, searchParams }: Args) {
  return generateThemeMetadata('userDetail', { params, searchParams })
}
