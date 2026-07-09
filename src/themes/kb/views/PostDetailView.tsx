import Link from 'next/link'
import React from 'react'

import { CommentsSection } from '@/components/Comments'
import { getPostsListPath } from '@/utilities/frontendPaths'

import { ArticleCopyright } from '../components/ArticleCopyright'
import { KbArticleBody } from '../components/ArticleBody'
import type { PostDetailPageData } from '../pages/postDetail'

type Props = { data: PostDetailPageData }

export function PostDetailView({ data }: Props) {
  const { post, dateStr, categories, tags, articleUrl } = data

  return (
    <article className="kb-article">
      <header className="kb-article-header">
        <Link className="kb-back-link" href={getPostsListPath()} prefetch={false}>
          ← 全部文档
        </Link>
        <h1 className="kb-article-title">{post.title}</h1>
        <div className="kb-article-meta">
          {dateStr ? <time>{dateStr}</time> : null}
          {categories.map((item) => (
            <span className="kb-doc-card-badge" key={item}>
              {item}
            </span>
          ))}
          {tags.map((item) => (
            <span className="kb-tag" key={item}>
              #{item}
            </span>
          ))}
        </div>
      </header>

      <KbArticleBody content={post.content}>
        <ArticleCopyright articleUrl={articleUrl} publishDate={dateStr} />
        <CommentsSection targetId={post.id} targetType="post" />
      </KbArticleBody>
    </article>
  )
}
