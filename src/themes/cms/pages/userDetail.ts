import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import type { SlugPageProps } from '@/themes/types'

import type { PostListItem } from '../data/types'
import { pickPublicAuthorBio, pickPublicAuthorBioDetail } from '../data/types'
import { queryUserPage } from '../data/queries'
import { UserDetailView } from '../views/UserDetailView'

export type UserDetailPageData = {
  userName: string
  userBio?: string
  userBioDetail?: DefaultTypedEditorState
  posts: PostListItem[]
}

export async function loadUserDetailPageData({ params }: SlugPageProps): Promise<UserDetailPageData> {
  const { slug } = await params
  const page = await queryUserPage(decodeURIComponent(slug))

  if (!page?.user?.name) notFound()

  return {
    userName: page.user.name,
    userBio: pickPublicAuthorBio(page.user),
    userBioDetail: pickPublicAuthorBioDetail(page.user),
    posts: page.posts,
  }
}

export async function userDetailPageMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await queryUserPage(decodeURIComponent(slug))
  if (!page?.user?.name) return { title: '用户不存在' }
  return { title: page.user.name }
}

export const userDetailPage = {
  params: 'slug' as const,
  load: loadUserDetailPageData,
  View: UserDetailView,
  metadata: userDetailPageMetadata,
}
