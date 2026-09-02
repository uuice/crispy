import React from 'react'

import { frontendLabels } from '@/i18n/frontend-labels'
import { getCategoryPath } from '@/utilities/frontendPaths'

import type { CategoryDetailPageData } from '../pages/categoryDetail'
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
        subtitle={frontendLabels.category.browse}
        title={`${frontendLabels.category.titlePrefix}${category.title}`}
      />
      <div className="intro-bubble animate-in animate-in-delay-1">
        <p className="m-0 code-label">
          共 <strong>{pagination.totalDocs}</strong> 篇文章
        </p>
      </div>
      <PostList emptyMessage="该分类下暂无文章" posts={posts} />
      <PaginationNav basePath={getCategoryPath(category.slug || '')} pagination={pagination} />
    </>
  )
}
