import React from 'react'

import { CommentsSection } from '@/components/Comments'

import type { PageDetailPageData } from '../pages/pageDetail'
import { Banner } from '../components/Banner'
import { BlogRenderBlocks } from '../components/BlogRenderBlocks'

type Props = {
  data: PageDetailPageData
}

export function PageDetailView({ data }: Props) {
  const { page, dateStr } = data

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
