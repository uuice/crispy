import type { Post } from '@/payload-types'

import { getNovelChapterPath } from '@/utilities/frontendPaths'

/** Returns the canonical novel chapter URL when the post belongs to an enabled novel. */
export function resolveNovelChapterPostUrl(post: Post | null | undefined): string | null {
  if (!post?.slug) return null

  const novel = typeof post.novel === 'object' ? post.novel : null
  if (!novel?.slug || novel.enabled === false) return null

  return getNovelChapterPath(novel.slug, post.slug)
}
