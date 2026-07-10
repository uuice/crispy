import type { Where } from 'payload'

/** Published posts for the blog stream (excludes novel chapters). */
export const publishedBlogPostsWhere: Where = {
  and: [{ _status: { equals: 'published' } }, { novel: { exists: false } }],
}

/** Published posts that belong to a novel (chapter updates). */
export const publishedNovelChapterPostsWhere: Where = {
  and: [{ _status: { equals: 'published' } }, { novel: { exists: true } }],
}

export function withPublishedBlogPostsWhere(extra?: Where): Where {
  if (!extra) return publishedBlogPostsWhere
  return { and: [publishedBlogPostsWhere, extra] }
}
