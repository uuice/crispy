import type { Where } from 'payload'

/** Published posts for the blog stream. */
export const publishedBlogPostsWhere: Where = {
  _status: { equals: 'published' },
}

export function withPublishedBlogPostsWhere(extra?: Where): Where {
  if (!extra) return publishedBlogPostsWhere
  return { and: [publishedBlogPostsWhere, extra] }
}
