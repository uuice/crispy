import type { CollectionConfig } from 'payload'

/** Default version history depth for collections without draft workflows. */
export const DEFAULT_VERSIONS_MAX_PER_DOC = 50

export const defaultCollectionVersions: NonNullable<CollectionConfig['versions']> = {
  maxPerDoc: DEFAULT_VERSIONS_MAX_PER_DOC,
}

/** Payload-managed collections that should not get trash or versions. */
export const INTERNAL_COLLECTION_PREFIX = 'payload-'

export const SYSTEM_COLLECTION_SLUGS = new Set(['frontend-cache-entries', 'api-access-logs'])

export function isInternalCollectionSlug(slug: string): boolean {
  return slug.startsWith(INTERNAL_COLLECTION_PREFIX) || SYSTEM_COLLECTION_SLUGS.has(slug)
}
