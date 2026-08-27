import type { ReactNode } from 'react'

import { NovelSlugLayout } from '@/frontend/components/NovelSlugLayout'

export const revalidate = false

export default function NovelSlugRouteLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<unknown>
}) {
  return (
    <NovelSlugLayout params={params as Promise<{ slug: string }>}>{children}</NovelSlugLayout>
  )
}
