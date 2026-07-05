import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import React from 'react'

import type { UserDetailPageData } from '../pages/userDetail'
import { KbRichText } from '../components/RichText'
import { PageHeader } from '../components/PageHeader'
import { PostList } from '../components/PostList'

type Props = { data: UserDetailPageData }

export function UserDetailView({ data }: Props) {
  const { userName, userBio, userBioDetail, posts } = data

  return (
    <>
      <PageHeader
        eyebrow="Author"
        stats={<span className="kb-stat-pill">{posts.length} 篇内容</span>}
        subtitle={userBio}
        title={userName}
      />
      <div className="kb-container kb-page-body">
        {userBioDetail ? (
          <article className="kb-section-card kb-page-section markdown-body">
            <KbRichText data={userBioDetail as DefaultTypedEditorState} enableGutter={false} />
          </article>
        ) : null}
        <PostList columns={2} posts={posts} />
      </div>
    </>
  )
}
