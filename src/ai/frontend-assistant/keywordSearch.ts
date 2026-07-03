import {
  getPublicContent,
  listPublicContent,
  parsePublicContentTypes,
  PUBLIC_CONTENT_TYPES,
  searchPublicContent,
  type PublicContentHit,
  type PublicContentType,
} from './publicContent'

export type { PublicContentHit, PublicContentType }

export async function runKeywordContentSearch(
  query: string,
  limit = 10,
  types?: PublicContentType[],
): Promise<PublicContentHit[]> {
  return searchPublicContent(query, { limit, types })
}

export async function runListPublicContent(
  type: PublicContentType,
  options: { query?: string; limit?: number } = {},
): Promise<PublicContentHit[]> {
  return listPublicContent(type, options)
}

export async function runGetPublicContent(type: PublicContentType, slug: string) {
  return getPublicContent(type, slug)
}

export { PUBLIC_CONTENT_TYPES, parsePublicContentTypes }
