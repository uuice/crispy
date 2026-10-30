import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { lexicalToPlainText } from '@/ai/lexical/toPlainText'
import type { Media } from '@/payload-types'

export type PostCover = Pick<
  Media,
  'url' | 'alt' | 'width' | 'height' | 'mimeType' | 'sizes' | 'thumbnailURL' | 'updatedAt'
>

export type PostListItem = {
  title: string
  url: string
  excerpt?: string
  pubDate: string
  categories: string[]
  tags: string[]
  cover?: PostCover
}

export type PaginatedPostList = {
  posts: PostListItem[]
  page: number
  pageSize: number
  totalDocs: number
  totalPages: number
}

export type SidebarCategory = {
  id: string
  title: string
  url: string
  count: number
}

export type SidebarTag = {
  id: string
  title: string
  url: string
  count: number
}

export type NavItem = {
  title: string
  url: string
  target?: string | null
}

export type SidebarAuthor = {
  id: string
  title: string
  url: string
  count: number
}

export type SidebarUser = {
  title: string
  /** Public author bio; omitted when empty in CMS. */
  excerpt?: string
  url: string
}

export function pickPublicAuthorBio(
  entry: { bio?: string | null } | null | undefined,
): string | undefined {
  const bio = entry?.bio?.trim()
  return bio || undefined
}

export function pickPublicAuthorBioDetail(
  entry: { bioDetail?: unknown } | null | undefined,
): DefaultTypedEditorState | undefined {
  const detail = entry?.bioDetail
  if (!detail || typeof detail !== 'object') return undefined
  if (!lexicalToPlainText(detail, 1)) return undefined
  return detail as DefaultTypedEditorState
}

export type SidebarData = {
  categories: SidebarCategory[]
  tags: SidebarTag[]
  authors: SidebarAuthor[]
  menu: NavItem[]
  footerMenu: NavItem[]
}
