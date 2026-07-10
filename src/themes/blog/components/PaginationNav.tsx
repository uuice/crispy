import Link from 'next/link'
import React from 'react'

import type { PaginationMeta } from '../pagination'

type Props = {
  basePath: string
  pagination: PaginationMeta
}

function pageHref(basePath: string, page: number): string {
  if (page <= 1) return basePath
  const separator = basePath.includes('?') ? '&' : '?'
  return `${basePath}${separator}page=${page}`
}

export function PaginationNav({ basePath, pagination }: Props) {
  const { page, totalPages, hasPrevPage, hasNextPage } = pagination
  if (totalPages <= 1) return null

  return (
    <nav aria-label="分页导航" className="blog-pagination animate-in">
      <div className="blog-pagination-inner">
        {hasPrevPage ? (
          <Link className="blog-pagination-link" href={pageHref(basePath, page - 1)} prefetch={false}>
            上一页
          </Link>
        ) : (
          <span className="blog-pagination-link blog-pagination-link--disabled">上一页</span>
        )}
        <span className="blog-pagination-status code-label">
          第 {page} / {totalPages} 页
        </span>
        {hasNextPage ? (
          <Link className="blog-pagination-link" href={pageHref(basePath, page + 1)} prefetch={false}>
            下一页
          </Link>
        ) : (
          <span className="blog-pagination-link blog-pagination-link--disabled">下一页</span>
        )}
      </div>
    </nav>
  )
}
