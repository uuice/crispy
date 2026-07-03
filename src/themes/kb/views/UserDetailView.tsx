import React from 'react'

import type { UserDetailPageData } from '../pages/userDetail'
import { PageHeader } from '../components/PageHeader'
import { PostList } from '../components/PostList'

type Props = { data: UserDetailPageData }

export function UserDetailView({ data }: Props) {
  const { userName, posts } = data

  return (
    <>
      <PageHeader
        eyebrow="Author"
        stats={<span className="kb-stat-pill">{posts.length} 篇内容</span>}
        title={userName}
      />
      <div className="kb-container kb-page-body">
        <PostList columns={2} posts={posts} />
      </div>
    </>
  )
}
