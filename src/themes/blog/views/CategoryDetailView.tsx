import React from 'react'

import type { CategoryDetailPageData } from '../pages/categoryDetail'
import { Banner } from '../components/Banner'
import { PostList } from '../components/PostList'

type Props = {
  data: CategoryDetailPageData
}

export function CategoryDetailView({ data }: Props) {
  const { category, posts } = data

  return (
    <>
      <Banner
        subtitle={posts.length ? `共 ${posts.length} 篇` : undefined}
        title={`分类: ${category.title}`}
      />
      <div className="intro-bubble animate-in animate-in-delay-1">
        <p className="m-0 code-label">
          共 <strong>{posts.length}</strong> 篇文章
        </p>
      </div>
      <section className="space-y-5">
        <h2 className="section-title animate-in animate-in-delay-2">{category.title}</h2>
        <PostList emptyMessage="该分类下暂无文章" posts={posts} />
      </section>
    </>
  )
}
