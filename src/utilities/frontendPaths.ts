import type { CollectionSlug } from 'payload'

/** Public URL segments aligned with Payload collection slugs. */
export const frontendCollectionRoutes = {
  posts: 'posts',
  pages: 'pages',
  categories: 'categories',
  tags: 'tags',
  users: 'users',
  links: 'links',
  galleries: 'galleries',
} as const satisfies Partial<Record<CollectionSlug, string>>

export function getPostsListPath(): string {
  return `/${frontendCollectionRoutes.posts}`
}

export function getPostPath(slug: string): string {
  return `${getPostsListPath()}/${slug}`
}

export function getPagePath(slug: string): string {
  if (slug === 'home') return '/'
  return `/${frontendCollectionRoutes.pages}/${slug}`
}

export function getCategoryPath(slug: string): string {
  return `/${frontendCollectionRoutes.categories}/${slug}`
}

export function getTagPath(slug: string): string {
  return `/${frontendCollectionRoutes.tags}/${slug}`
}

export function getUserPath(slug: string): string {
  return `/${frontendCollectionRoutes.users}/${slug}`
}

export function getLinksPath(): string {
  return `/${frontendCollectionRoutes.links}`
}

export function getShortLinkPath(slug: string): string {
  return `/s/${encodeURIComponent(slug)}`
}

export function getGalleriesPath(): string {
  return `/${frontendCollectionRoutes.galleries}`
}

export function getGalleryPath(slug: string): string {
  return `${getGalleriesPath()}/${encodeURIComponent(slug)}`
}

export function getCollectionDocumentPath(collection: CollectionSlug, slug: string): string | null {
  switch (collection) {
    case 'posts':
      return getPostPath(slug)
    case 'pages':
      return getPagePath(slug)
    case 'categories':
      return getCategoryPath(slug)
    case 'tags':
      return getTagPath(slug)
    case 'galleries':
      return getGalleryPath(slug)
    case 'users':
      return getUserPath(slug)
    default:
      return null
  }
}

export function slugifyUserName(name: string | null | undefined, id: number | string): string {
  if (!name) return String(id)
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '')
  return slug || String(id)
}
