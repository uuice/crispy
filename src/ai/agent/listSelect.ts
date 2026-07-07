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
    novel: true,
    deletedAt: true,
  },
  novels: {
    id: true,
    title: true,
    slug: true,
    enabled: true,
    genre: true,
    synopsis: true,
    writingStyle: true,
    worldBuilding: true,
    constraints: true,
    characters: true,
    plotOutline: true,
    currentProgress: true,
    chapterTargetWords: true,
    chapterCategory: true,
    chapterTag: true,
    updatedAt: true,
    createdAt: true,
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
  jobs: {
    id: true,
    title: true,
    slug: true,
    department: true,
    location: true,
    employmentType: true,
    salary: true,
    publishedAt: true,
    enabled: true,
    updatedAt: true,
    createdAt: true,
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
}

export function resolveAgentListSelect(
  collection: string,
): Record<string, true> | undefined {
  return AGENT_LIST_SELECT[collection as CollectionSlug]
}
