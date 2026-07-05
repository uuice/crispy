import React from 'react'

import type { UserDetailPageData } from '../pages/userDetail'
import { Banner } from '../components/Banner'
import { BlogRichText } from '../components/BlogRichText'
import { PostList } from '../components/PostList'

type Props = {
  data: UserDetailPageData
}

export function UserDetailView({ data }: Props) {
  const { userName, userBio, userBioDetail, posts } = data
  const bannerSubtitle =
    userBio || (posts.length ? `共 ${posts.length} 篇文章` : undefined)

  return (
    <>
      <Banner subtitle={bannerSubtitle} title={userName} />
      {userBioDetail ? (
        <article className="section-card p-6 md:p-10 animate-in animate-in-delay-2">
          <div className="prose max-w-none prose-headings:font-semibold prose-img:rounded-xl markdown-body">
            <BlogRichText data={userBioDetail} enableGutter={false} />
          </div>
        </article>
      ) : null}
      <div className="intro-bubble animate-in animate-in-delay-1">
        <p className="m-0 code-label">
          共 <strong>{posts.length}</strong> 篇文章
        </p>
      </div>
      <section className="space-y-5">
        <h2 className="section-title animate-in animate-in-delay-2">{userName} 的文章</h2>
        <PostList emptyMessage="该用户暂无文章" posts={posts} />
      </section>
    </>
  )
}
