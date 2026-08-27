import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import type { SlugPageProps } from '@/frontend/types'
import { getUserPath } from '@/utilities/frontendPaths'

import type { PostListItem } from '@/frontend/data/types'
import { pickPublicAuthorBio, pickPublicAuthorBioDetail } from '@/frontend/data/types'
import { queryUserPagePaginated } from '../data/queries'
import {
  BLOG_LIST_PAGE_SIZE,
  buildPaginationMeta,
  parsePageParam,
} from '../pagination'
import type { PaginationMeta } from '../pagination'
import { buildBlogListMetadata } from '../seo'
import { UserDetailView } from '../views/UserDetailView'

export type UserDetailPageData = {
  userName: string
  userSlug: string
  userBio?: string
  userBioDetail?: DefaultTypedEditorState
  posts: PostListItem[]
  pagination: PaginationMeta
}

export async function loadUserDetailPageData({
  params,
  searchParams,
}: SlugPageProps): Promise<UserDetailPageData> {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const page = parsePageParam(searchParams ? await searchParams : undefined)
  const result = await queryUserPagePaginated(decodedSlug, page, BLOG_LIST_PAGE_SIZE)

  if (!result?.user?.name) notFound()

  return {
    userName: result.user.name,
    userSlug: decodedSlug,
    userBio: pickPublicAuthorBio(result.user),
    userBioDetail: pickPublicAuthorBioDetail(result.user),
    posts: result.posts,
    pagination: buildPaginationMeta(result.page, result.pageSize, result.totalDocs),
  }
}

export async function userDetailPageMetadata({
  params,
  searchParams,
}: SlugPageProps): Promise<Metadata> {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const page = parsePageParam(searchParams ? await searchParams : undefined)
  const result = await queryUserPagePaginated(decodedSlug, 1, 1)
  if (!result?.user?.name) return { title: '用户不存在' }

  return buildBlogListMetadata({
    title: result.user.name,
    description: pickPublicAuthorBio(result.user) || `查看 ${result.user.name} 发布的文章`,
    path: getUserPath(decodedSlug),
    page,
  })
}

export const userDetailPage = {
  params: 'slug' as const,
  load: loadUserDetailPageData,
  View: UserDetailView,
  metadata: userDetailPageMetadata,
}
