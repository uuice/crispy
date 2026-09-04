import type { CollectionSlug } from 'payload'

/**
 * Default select for agent list queries — omits rich text and block layout bodies.
 * Use get_document when the agent needs full content.
 */
const AGENT_LIST_SELECT: Partial<Record<CollectionSlug, Record<string, true>>> = {
  posts: {
    id: true,
    title: true,
    slug: true,
    meta: true,
    publishedAt: true,
    updatedAt: true,
    createdAt: true,
    _status: true,
    categories: true,
    tags: true,
    authors: true,
    populatedAuthors: true,
    heroImage: true,
    relatedPosts: true,
    deletedAt: true,
  },
  pages: {
    id: true,
    title: true,
    slug: true,
    meta: true,
    publishedAt: true,
    updatedAt: true,
    createdAt: true,
    _status: true,
    deletedAt: true,
  },
  media: {
    id: true,
    alt: true,
    filename: true,
    mimeType: true,
    filesize: true,
    width: true,
    height: true,
    url: true,
    updatedAt: true,
    createdAt: true,
    deletedAt: true,
  },
  'prompt-templates': {
    id: true,
    title: true,
    slug: true,
    action: true,
    outputFormat: true,
    enabled: true,
    sort: true,
    provider: true,
    model: true,
    temperature: true,
    maxTokens: true,
    updatedAt: true,
    createdAt: true,
    deletedAt: true,
  },
}

export function resolveAgentListSelect(
  collection: string,
): Record<string, true> | undefined {
  return AGENT_LIST_SELECT[collection as CollectionSlug]
}
