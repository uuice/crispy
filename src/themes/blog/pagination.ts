import type { PostListItem } from './data/types'

export const BLOG_HOME_POST_LIMIT = 12
export const BLOG_LIST_PAGE_SIZE = 12

export type ThemeSearchParams = Record<string, string | string[] | undefined>

export type PaginationMeta = {
  page: number
  pageSize: number
  totalDocs: number
  totalPages: number
  hasPrevPage: boolean
  hasNextPage: boolean
}

export function parsePageParam(searchParams?: ThemeSearchParams): number {
  const raw = searchParams?.page
  const value = Array.isArray(raw) ? raw[0] : raw
  const parsed = Number.parseInt(value ?? '1', 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

export function buildPaginationMeta(
  page: number,
  pageSize: number,
  totalDocs: number,
): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(totalDocs / pageSize))
  const currentPage = Math.min(page, totalPages)

  return {
    page: currentPage,
    pageSize,
    totalDocs,
    totalPages,
    hasPrevPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
  }
}

export function groupPostsByYearMonth(posts: PostListItem[]): Array<[string, PostListItem[]]> {
  const byYearMonth = new Map<string, PostListItem[]>()

  for (const post of posts) {
    const d = new Date(post.pubDate)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!byYearMonth.has(key)) byYearMonth.set(key, [])
    byYearMonth.get(key)!.push(post)
  }

  return Array.from(byYearMonth.entries()).sort((a, b) => b[0].localeCompare(a[0]))
}
