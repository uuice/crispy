import React from 'react'

import type { CategoryDetailPageData } from '../pages/categoryDetail'
import { getCategoryPath } from '@/utilities/frontendPaths'
import { Banner } from '../components/Banner'
import { PaginationNav } from '../components/PaginationNav'
import { PostList } from '../components/PostList'

type Props = {
  data: CategoryDetailPageData
}

export function CategoryDetailView({ data }: Props) {
  const { category, posts, pagination } = data

  return (
    <>
      <Banner
        subtitle={pagination.totalDocs ? `共 ${pagination.totalDocs} 篇` : undefined}
        title={`分类: ${category.title}`}
      />
      <div className="intro-bubble animate-in animate-in-delay-1">
        <p className="m-0 code-label">
          共 <strong>{pagination.totalDocs}</strong> 篇文章
        </p>
      </div>
      <section className="space-y-5">
        <h2 className="content-title animate-in animate-in-delay-2">{category.title}</h2>
        <PostList emptyMessage="该分类下暂无文章" posts={posts} />
      </section>
      <PaginationNav basePath={getCategoryPath(category.slug || '')} pagination={pagination} />
    </>
  )
}
