import type { CollectionSlug } from 'payload'

export type SuggestTaxonomySource = {
  categoryCollection: CollectionSlug
  tagCollection: CollectionSlug
}

const NOVEL_TAXONOMY: SuggestTaxonomySource = {
  categoryCollection: 'novel-categories',
  tagCollection: 'novel-tags',
}

const BLOG_TAXONOMY: SuggestTaxonomySource = {
  categoryCollection: 'categories',
  tagCollection: 'tags',
}

/** Resolve which taxonomy collections suggest_taxonomy should load for a document collection. */
export function resolveSuggestTaxonomySource(collection: string): SuggestTaxonomySource | null {
  if (collection === 'posts') return BLOG_TAXONOMY
  if (collection === 'novels' || collection === 'novel-chapters') return NOVEL_TAXONOMY
  return null
}
