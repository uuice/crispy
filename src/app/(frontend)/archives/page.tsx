import type { Metadata } from 'next'
import React from 'react'

import { Banner } from '@/components/BlogSkin/Banner'
import { PostCard } from '@/components/BlogSkin/PostCard'
import { queryBlogArchiveGroups, queryBlogPosts } from '@/utilities/queryBlogData'

export const revalidate = false

export default async function ArchivesPage() {
  const [posts, groups] = await Promise.all([queryBlogPosts(), queryBlogArchiveGroups()])

  return (
    <>
      <Banner subtitle="按时间查看文章" title="归档" />
      <div className="intro-bubble animate-in animate-in-delay-1">
        <p className="m-0 code-label">
          共 <strong>{posts.length}</strong> 篇文章
        </p>
      </div>
      <section className="space-y-8">
        {groups.map(([ym, list], i) => (
          <div
            className="section-card p-5 sm:p-6 animate-in archive-group"
            key={ym}
            style={{ animationDelay: `${0.1 + i * 0.05}s` }}
          >
            <h2 className="section-title">{ym}</h2>
            <p className="code-label mb-3">{list.length} 篇文章</p>
            <ul className="post-list terminal-list">
              {list.map((entry) => (
                <li key={entry.url}>
                  <PostCard {...entry} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  )
}

export const metadata: Metadata = {
  title: '归档',
}
