import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { Banner } from '@/components/BlogSkin/Banner'
import { BlogRenderBlocks } from '@/components/BlogSkin/BlogRenderBlocks'
import { CommentsSection } from '@/components/Comments'
import { queryPageBySlug } from '@/utilities/queryFrontendData'

export const revalidate = false

type Args = {
  params: Promise<{ slug: string }>
}

export default async function CmsPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const page = await queryPageBySlug(decodeURIComponent(slug))

  if (!page) notFound()

  const dateStr = page.updatedAt
    ? new Date(page.updatedAt).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : ''

  return (
    <>
      <Banner subtitle={page.meta?.description || undefined} title={page.title} />
      {dateStr ? (
        <div className="intro-bubble">
          <p className="doc-detail-meta flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              <span aria-label="日期" className="doc-detail-meta-label">
                日期：
              </span>
              {dateStr}
            </span>
          </p>
        </div>
      ) : null}
      <article className="section-card p-6 md:p-10 markdown-body">
        <BlogRenderBlocks blocks={page.layout || []} />
        <CommentsSection targetId={page.id} targetType="page" />
      </article>
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const page = await queryPageBySlug(decodeURIComponent(slug))
  if (!page) return { title: '页面不存在' }
  return {
    title: page.title,
    description: page.meta?.description || undefined,
  }
}

export async function generateStaticParams() {
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

  return pages.docs.map(({ slug }) => ({ slug }))
}
