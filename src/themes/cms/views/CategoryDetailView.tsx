import React from 'react'

import type { CategoryDetailPageData } from '../pages/categoryDetail'
import { PageHeader } from '../components/PageHeader'
import { PostList } from '../components/PostList'

type Props = { data: CategoryDetailPageData }

export function CategoryDetailView({ data }: Props) {
  const { category, posts } = data

  return (
    <>
      <PageHeader
        eyebrow="Category"
        stats={<span className="cms-stat-pill">{posts.length} 篇内容</span>}
        title={category.title}
      />
      <div className="cms-container cms-page-body">
        <PostList columns={2} posts={posts} />
      </div>
    </>
  )
}
