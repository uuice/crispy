import React from 'react'

import type { UserDetailPageData } from '../pages/userDetail'
import { Banner } from '../components/Banner'
import { PostList } from '../components/PostList'

type Props = {
  data: UserDetailPageData
}

export function UserDetailView({ data }: Props) {
  const { userName, posts } = data

  return (
    <>
      <Banner title={userName} />
      <article className="section-card p-6 md:p-10 markdown-body animate-in animate-in-delay-2">
        <PostList emptyMessage="该用户暂无文章" posts={posts} />
      </article>
    </>
  )
}
