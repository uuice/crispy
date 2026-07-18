import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
  CollectionSlug,
  Plugin,
} from 'payload'

import { AuditLogs, AUDIT_LOG_SLUG } from '@/collections/AuditLogs'
import { createAuditLogHook, createAuditDeleteHook } from './auditLogHooks'

const DEFAULT_AUDITED_COLLECTIONS: CollectionSlug[] = [
  'posts',
  'pages',
  'media',
  'categories',
  'tags',
  'links',
  'link-groups',
  'ad-slots',
  'ads',
  'jobs',
  'galleries',
  'gallery-items',
  'novels',
  'novel-chapters',
  'novel-categories',
  'novel-tags',
  'app-configs',
  'comments',
  'users',
]

const SYSTEM_COLLECTION_PREFIXES = ['payload-', AUDIT_LOG_SLUG]

function isAuditableCollection(slug: string, allowlist: CollectionSlug[]): boolean {
  if (slug === AUDIT_LOG_SLUG) return false
  if (SYSTEM_COLLECTION_PREFIXES.some((prefix) => slug.startsWith(prefix))) return false
  return allowlist.includes(slug as CollectionSlug)
}

function mergeAfterChangeHooks(
  collection: CollectionConfig,
  hook: CollectionAfterChangeHook,
): CollectionConfig {
  const existing = collection.hooks?.afterChange ?? []
  return {
    ...collection,
    hooks: {
      ...collection.hooks,
      afterChange: [...existing, hook],
    },
  }
}

function mergeAfterDeleteHooks(
  collection: CollectionConfig,
  hook: CollectionAfterDeleteHook,
): CollectionConfig {
  const existing = collection.hooks?.afterDelete ?? []
  return {
    ...collection,
    hooks: {
      ...collection.hooks,
      afterDelete: [...existing, hook],
    },
  }
}

export type AuditLogPluginOptions = {
  collections?: CollectionSlug[]
}

export function auditLogPlugin(options: AuditLogPluginOptions = {}): Plugin {
  const allowlist = options.collections ?? DEFAULT_AUDITED_COLLECTIONS

  return (incomingConfig) => {
    const collections = (incomingConfig.collections ?? []).map((collection) => {
      if (!isAuditableCollection(collection.slug, allowlist)) {
        return collection
      }

      const afterChange = createAuditLogHook(collection.slug)
      const afterDelete = createAuditDeleteHook(collection.slug)

      return mergeAfterDeleteHooks(
        mergeAfterChangeHooks(collection, afterChange),
        afterDelete,
      )
    })

    return {
      ...incomingConfig,
      collections: [...collections, AuditLogs],
    }
  }
}

