import React from 'react'

import type { TagDetailPageData } from '../pages/tagDetail'
import { Banner } from '../components/Banner'
import { PostList } from '../components/PostList'

type Props = {
  data: TagDetailPageData
}

export function TagDetailView({ data }: Props) {
  const { tag, posts } = data

  return (
    <>
      <Banner subtitle={posts.length ? `共 ${posts.length} 篇` : undefined} title={`标签: ${tag.title}`} />
      <div className="intro-bubble animate-in animate-in-delay-1">
        <p className="m-0 code-label">
          共 <strong>{posts.length}</strong> 篇文章
        </p>
      </div>
      <section className="space-y-5">
        <h2 className="section-title animate-in animate-in-delay-2">{tag.title}</h2>
        <PostList emptyMessage="该标签下暂无文章" posts={posts} />
      </section>
    </>
  )
}
