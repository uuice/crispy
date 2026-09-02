import React from 'react'

import { frontendLabels } from '@/i18n/frontend-labels'
import { getTagPath } from '@/utilities/frontendPaths'

import type { TagDetailPageData } from '../pages/tagDetail'
import { Banner } from '../components/Banner'
import { PaginationNav } from '../components/PaginationNav'
import { PostList } from '../components/PostList'

type Props = {
  data: TagDetailPageData
}

export function TagDetailView({ data }: Props) {
  const { tag, posts, pagination } = data

  return (
    <>
      <Banner
        subtitle={frontendLabels.tag.browse}
        title={`${frontendLabels.tag.titlePrefix}${tag.title}`}
      />
      <div className="intro-bubble animate-in animate-in-delay-1">
        <p className="m-0 code-label">
          共 <strong>{pagination.totalDocs}</strong> 篇文章
        </p>
      </div>
      <PostList emptyMessage="该标签下暂无文章" posts={posts} />
      <PaginationNav basePath={getTagPath(tag.slug || '')} pagination={pagination} />
    </>
  )
}
