import React from 'react'

import { CommentsSection } from '@/components/Comments'

import { CmsRenderBlocks } from '../components/RenderBlocks'
import { PageHeader } from '../components/PageHeader'
import type { PageDetailPageData } from '../pages/pageDetail'

type Props = { data: PageDetailPageData }

export function PageDetailView({ data }: Props) {
  const { page, dateStr } = data

  return (
    <>
      <PageHeader
        eyebrow="Page"
        stats={dateStr ? <span className="cms-stat-pill">更新于 {dateStr}</span> : undefined}
        subtitle={page.meta?.description || undefined}
        title={page.title}
      />

      <div className="cms-container cms-page-body">
        <article className="cms-article cms-article--page markdown-body">
          <CmsRenderBlocks blocks={page.layout || []} />
          <CommentsSection targetId={page.id} targetType="page" />
        </article>
      </div>
    </>
  )
}
