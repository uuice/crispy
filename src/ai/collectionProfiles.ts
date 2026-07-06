export type CollectionAiSuggestConfig = {
  /** Apply AI summary to a textarea field (e.g. description) */
  descriptionPath?: string
  /** Suggest categories & tags (posts only) */
  taxonomy?: boolean
}

export type CollectionAiProfile = {
  /** Field paths used as context for SEO / suggest (supports dot paths) */
  contentFields: string[]
  seo?: boolean
  suggest?: CollectionAiSuggestConfig
}

/** Runtime AI capabilities per collection slug. */
export const COLLECTION_AI_PROFILES: Record<string, CollectionAiProfile> = {
  posts: {
    contentFields: ['content'],
    seo: true,
    suggest: { taxonomy: true },
  },
  pages: {
    contentFields: ['hero.richText'],
    seo: true,
    suggest: {},
  },
  jobs: {
    contentFields: ['description', 'requirements'],
  },
  categories: {
    contentFields: [],
  },
  tags: {
    contentFields: ['description'],
    suggest: { descriptionPath: 'description' },
  },
  'gallery-items': {
    contentFields: ['description'],
    suggest: { descriptionPath: 'description' },
  },
  links: {
    contentFields: ['description'],
    suggest: { descriptionPath: 'description' },
  },
  'link-groups': {
    contentFields: ['description'],
    suggest: { descriptionPath: 'description' },
  },
  ads: {
    contentFields: ['alt'],
  },
  'ad-slots': {
    contentFields: ['description'],
    suggest: { descriptionPath: 'description' },
  },
  media: {
    contentFields: ['caption'],
  },
}

export const AI_ENABLED_COLLECTIONS = Object.keys(COLLECTION_AI_PROFILES)

export function getCollectionAiProfile(collection?: string | null): CollectionAiProfile | null {
  if (!collection) return null
  return COLLECTION_AI_PROFILES[collection] ?? null
}

export function isAiEnabledCollection(collection?: string | null): boolean {
  return Boolean(collection && collection in COLLECTION_AI_PROFILES)
}
