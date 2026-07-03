import React from 'react'

import type { TagDetailPageData } from '../pages/tagDetail'
import { PageHeader } from '../components/PageHeader'
import { PostList } from '../components/PostList'

type Props = { data: TagDetailPageData }

export function TagDetailView({ data }: Props) {
  const { tag, posts } = data

  return (
    <>
      <PageHeader
        eyebrow="Tag"
        stats={<span className="kb-stat-pill">{posts.length} 篇内容</span>}
        title={`#${tag.title}`}
      />
      <div className="kb-container kb-page-body">
        <PostList columns={2} posts={posts} />
      </div>
    </>
  )
}
