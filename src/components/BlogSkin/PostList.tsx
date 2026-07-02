import React from 'react'

import type { BlogPostCard } from '@/utilities/queryBlogData'

import { PostCard } from './PostCard'

type Props = {
  posts: BlogPostCard[]
  emptyMessage?: string
}

export function PostList({ posts, emptyMessage = '暂时还没有文章' }: Props) {
  if (posts.length === 0) {
    return (
      <div className="section-card p-8 text-center animate-in animate-in-delay-3">
        <p className="m-0 code-label">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="section-card border-0! bg-transparent! overflow-hidden animate-in animate-in-delay-3">
      <ul className="post-list terminal-list">
        {posts.map((post) => (
          <li key={post.url}>
            <PostCard {...post} />
          </li>
        ))}
      </ul>
    </div>
  )
}
