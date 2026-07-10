import type { Metadata } from 'next'

import { frontendLabels } from '@/i18n/frontend-labels'
import { getPostsListPath } from '@/utilities/frontendPaths'
import type { ThemeListPageProps } from '@/themes/types'

import type { PostListItem } from '../data/types'
import { queryPostsPaginated } from '../data/queries'
import {
  BLOG_LIST_PAGE_SIZE,
  buildPaginationMeta,
  groupPostsByYearMonth,
  parsePageParam,
} from '../pagination'
import type { PaginationMeta } from '../pagination'
import { buildBlogListMetadata } from '../seo'
import { PostsView } from '../views/PostsView'

export type PostsPageData = {
  posts: PostListItem[]
  groups: Array<[string, PostListItem[]]>
  pagination: PaginationMeta
}

export async function loadPostsPageData({
  searchParams,
}: ThemeListPageProps = {}): Promise<PostsPageData> {
  const resolved = searchParams ? await searchParams : undefined
  const page = parsePageParam(resolved)
  const result = await queryPostsPaginated(page, BLOG_LIST_PAGE_SIZE)

  return {
    posts: result.posts,
    groups: groupPostsByYearMonth(result.posts),
    pagination: buildPaginationMeta(result.page, result.pageSize, result.totalDocs),
  }
}

export async function postsPageMetadata({
  searchParams,
}: ThemeListPageProps = {}): Promise<Metadata> {
  const resolved = searchParams ? await searchParams : undefined
  const page = parsePageParam(resolved)

  return buildBlogListMetadata({
    title: frontendLabels.posts.title,
    description: '按时间查看全部文章归档',
    path: getPostsListPath(),
    page,
  })
}

export const postsPage = {
  load: loadPostsPageData,
  View: PostsView,
  metadata: postsPageMetadata,
}
