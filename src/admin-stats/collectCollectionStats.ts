import type { CollectionConfig, CollectionSlug, Payload, PayloadRequest } from 'payload'

import type { CollectionStatRow, CollectionStatsSummary } from '@/admin-stats/types'

function collectionLabel(plural: unknown, slug: string): string {
  if (typeof plural === 'string' && plural.trim()) return plural
  return slug
}

function hasDraftsEnabled(versions: CollectionConfig['versions']): boolean {
  if (!versions || typeof versions !== 'object') return false
  return Boolean('drafts' in versions && versions.drafts)
}

async function safeCount(
  payload: Payload,
  options: Parameters<Payload['count']>[0],
): Promise<number | null> {
  try {
    const { totalDocs } = await payload.count(options)
    return totalDocs
  } catch {
    return null
  }
}

export async function collectCollectionStats(
  payload: Payload,
  req: PayloadRequest,
): Promise<CollectionStatsSummary> {
  const rows: CollectionStatRow[] = await Promise.all(
    payload.config.collections.map(async (collection) => {
      const slug = collection.slug as CollectionSlug
      const trashEnabled = Boolean(collection.trash)
      const draftsEnabled = hasDraftsEnabled(collection.versions)
      const base: CollectionStatRow = {
        slug,
        label: collectionLabel(collection.labels?.plural, slug),
        adminGroup:
          typeof collection.admin?.group === 'string' ? collection.admin.group : undefined,
        trashEnabled,
        draftsEnabled,
        activeCount: null,
        trashedCount: null,
        totalCount: null,
        draftCount: null,
        publishedCount: null,
        accessDenied: false,
      }

      const countOptions = {
        collection: slug,
        req,
        overrideAccess: false,
      } as const

      const activeCount = await safeCount(payload, countOptions)
      if (activeCount === null) {
        return { ...base, accessDenied: true }
      }

      let trashedCount: number | null = null
      let totalCount = activeCount

      if (trashEnabled) {
        trashedCount = await safeCount(payload, {
          ...countOptions,
          trash: true,
          where: {
            deletedAt: {
              exists: true,
            },
          },
        })
        const allCount = await safeCount(payload, {
          ...countOptions,
          trash: true,
        })
        if (allCount !== null) {
          totalCount = allCount
        }
      }

      let draftCount: number | null = null
      let publishedCount: number | null = null

      if (draftsEnabled) {
        draftCount = await safeCount(payload, {
          ...countOptions,
          where: {
            _status: {
              equals: 'draft',
            },
          },
        })
        publishedCount = await safeCount(payload, {
          ...countOptions,
          where: {
            _status: {
              equals: 'published',
            },
          },
        })
      }

      return {
        ...base,
        activeCount,
        trashedCount,
        totalCount,
        draftCount,
        publishedCount,
      }
    }),
  )

  rows.sort((a, b) => {
    const groupCompare = (a.adminGroup ?? '').localeCompare(b.adminGroup ?? '', 'zh-CN')
    if (groupCompare !== 0) return groupCompare
    return a.label.localeCompare(b.label, 'zh-CN')
  })

  return {
    rows,
    generatedAt: new Date().toISOString(),
    accessibleCollections: rows.filter((row) => !row.accessDenied).length,
    deniedCollections: rows.filter((row) => row.accessDenied).length,
  }
}
