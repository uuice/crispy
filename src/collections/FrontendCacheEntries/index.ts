import type { CollectionConfig } from 'payload'

import { isSuperAdmin } from '@/access/roles'
import { adminLabels } from '@/i18n/admin-labels'

export const FRONTEND_CACHE_ENTRIES_SLUG = 'frontend-cache-entries' as const

export const FrontendCacheEntries: CollectionConfig = {
  slug: FRONTEND_CACHE_ENTRIES_SLUG,
  labels: adminLabels.frontendCacheEntries,
  access: {
    create: () => false,
    delete: isSuperAdmin,
    read: isSuperAdmin,
    update: () => false,
  },
  admin: {
    defaultColumns: ['cacheKey', 'kind', 'routePath', 'updatedAt', 'expiresAt'],
    useAsTitle: 'cacheKey',
    group: adminLabels.systemGroup,
    description: 'Database-backed frontend cache entries (managed by the cache system).',
    hidden: true,
  },
  defaultSort: '-updatedAt',
  timestamps: true,
  fields: [
    {
      name: 'cacheKey',
      type: 'text',
      label: adminLabels.cacheKey,
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'kind',
      type: 'select',
      label: adminLabels.cacheKind,
      required: true,
      options: [
        { label: adminLabels.cacheKindData, value: 'data' },
        { label: adminLabels.cacheKindRoute, value: 'route' },
      ],
      defaultValue: 'data',
      index: true,
    },
    {
      name: 'routePath',
      type: 'text',
      label: adminLabels.cacheRoutePath,
      index: true,
      admin: {
        condition: (_, siblingData) => siblingData?.kind === 'route',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: adminLabels.cacheTags,
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'cachedValue',
      type: 'json',
      label: adminLabels.cachePayload,
      admin: {
        description: 'Data cache JSON payload, or route HTML metadata (html, contentType, statusCode).',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: adminLabels.cacheExpiresAt,
      index: true,
    },
  ],
}
