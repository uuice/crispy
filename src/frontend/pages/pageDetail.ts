import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import type { Page } from '@/payload-types'
import type { SlugPageProps } from '@/frontend/types'

import { queryPageBySlug } from '../data/queries'
import { buildBlogPageMetadata } from '../seo'
import { PageDetailView } from '../views/PageDetailView'

export type PageDetailPageData = {
  page: Page
  dateStr: string
}

export async function loadPageDetailPageData({ params }: SlugPageProps): Promise<PageDetailPageData> {
  const { slug } = await params
  const page = await queryPageBySlug(decodeURIComponent(slug))

  if (!page) notFound()

  const dateStr = page.updatedAt
    ? new Date(page.updatedAt).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : ''

  return { page, dateStr }
}

export async function pageDetailPageMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await queryPageBySlug(decodeURIComponent(slug))
  if (!page) return { title: '页面不存在' }
  return buildBlogPageMetadata(page)
}

export async function pageDetailStaticParams() {
  const configPromise = (await import('@payload-config')).default
  const { getPayload } = await import('payload')
  const payload = await getPayload({ config: configPromise })

  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
    where: { slug: { not_equals: 'home' } },
  })

  return pages.docs.map(({ slug }) => ({ slug: slug || '' }))
}

export const pageDetailPage = {
  params: 'slug' as const,
  load: loadPageDetailPageData,
  View: PageDetailView,
  metadata: pageDetailPageMetadata,
  staticParams: pageDetailStaticParams,
}
