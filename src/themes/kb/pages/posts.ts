import type { Metadata } from 'next'

import { frontendLabels } from '@/i18n/frontend-labels'

import type { PostListItem } from '../data/types'
import { queryPostArchiveGroups, queryPosts } from '../data/queries'
import { PostsView } from '../views/PostsView'

export type PostsPageData = {
  posts: PostListItem[]
  groups: Array<[string, PostListItem[]]>
}

export async function loadPostsPageData(): Promise<PostsPageData> {
  const [posts, groups] = await Promise.all([queryPosts(), queryPostArchiveGroups()])

  return { posts, groups }
}

export function postsPageMetadata(): Metadata {
  return { title: frontendLabels.posts.title }
}

export const postsPage = {
  load: loadPostsPageData,
  View: PostsView,
  metadata: postsPageMetadata,
}
