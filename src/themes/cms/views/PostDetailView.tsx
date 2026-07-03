import Link from 'next/link'
import React from 'react'

import { CommentsSection } from '@/components/Comments'
import { getPostsListPath } from '@/utilities/frontendPaths'

import { ArticleCopyright } from '../components/ArticleCopyright'
import { CmsArticleBody } from '../components/ArticleBody'
import type { PostDetailPageData } from '../pages/postDetail'

type Props = { data: PostDetailPageData }

export function PostDetailView({ data }: Props) {
  const { post, dateStr, categories, tags, articleUrl } = data

  return (
    <>
      <section className="cms-hero cms-hero--compact">
        <div aria-hidden="true" className="cms-hero-bg" />
        <div className="cms-container cms-hero-inner">
          <Link className="cms-back-link" href={getPostsListPath()}>
            ← 返回内容列表
          </Link>
          <h1 className="cms-hero-title cms-hero-title--article">{post.title}</h1>
          <div className="cms-article-meta">
            {dateStr ? <span>{dateStr}</span> : null}
            {categories.map((item) => (
              <span className="cms-card-badge" key={item}>
                {item}
              </span>
            ))}
            {tags.map((item) => (
              <span className="cms-tag" key={item}>
                #{item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="cms-container cms-page-body">
        <article className="cms-article">
          <CmsArticleBody content={post.content}>
            <ArticleCopyright articleUrl={articleUrl} publishDate={dateStr} />
            <CommentsSection targetId={post.id} targetType="post" />
          </CmsArticleBody>
        </article>
      </div>
    </>
  )
}
