import React from 'react'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import type { CardPostData } from '@/components/Card'

type PaginatedPosts = {
  docs: CardPostData[]
  page?: number
  totalDocs: number
  totalPages: number
}

type Props = {
  title: string
  description?: string | null
  posts: PaginatedPosts
  paginationBasePath?: string
}

export const PostArchiveLayout: React.FC<Props> = ({
  title,
  description,
  posts,
  paginationBasePath,
}) => {
  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
      </div>

      {posts.totalDocs > 0 && (
        <>
          <div className="container mb-8">
            <PageRange
              collection="posts"
              currentPage={posts.page}
              limit={12}
              totalDocs={posts.totalDocs}
            />
          </div>

          <CollectionArchive posts={posts.docs} showTags />

          {posts.totalPages > 1 && posts.page && paginationBasePath && (
            <div className="container">
              <Pagination
                basePath={paginationBasePath}
                page={posts.page}
                totalPages={posts.totalPages}
              />
            </div>
          )}
        </>
      )}

      {posts.totalDocs === 0 && (
        <div className="container">
          <p className="text-muted-foreground">暂无文章</p>
        </div>
      )}
    </div>
  )
}
