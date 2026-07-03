import React from 'react'

import { CommentsSection } from '@/components/Comments'

import { KbRenderBlocks } from '../components/RenderBlocks'
import { PageHeader } from '../components/PageHeader'
import type { PageDetailPageData } from '../pages/pageDetail'

type Props = { data: PageDetailPageData }

export function PageDetailView({ data }: Props) {
  const { page, dateStr } = data

  return (
    <>
      <PageHeader
        eyebrow="Page"
        stats={dateStr ? <span className="kb-stat-pill">更新于 {dateStr}</span> : undefined}
        subtitle={page.meta?.description || undefined}
        title={page.title}
      />

      <div className="kb-container kb-page-body">
        <article className="kb-article kb-article--page markdown-body">
          <KbRenderBlocks blocks={page.layout || []} />
          <CommentsSection targetId={page.id} targetType="page" />
        </article>
      </div>
    </>
  )
}
