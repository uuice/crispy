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
    defaultColumns: ['cacheKey', 'routePath', 'updatedAt', 'expiresAt'],
    useAsTitle: 'cacheKey',
    group: adminLabels.systemGroup,
    description: 'Database-backed frontend HTML cache (managed by /admin/cache).',
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
      options: [{ label: adminLabels.cacheKindRoute, value: 'route' }],
      defaultValue: 'route',
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'routePath',
      type: 'text',
      label: adminLabels.cacheRoutePath,
      index: true,
    },
    {
      name: 'cachedValue',
      type: 'json',
      label: adminLabels.cachePayload,
      admin: {
        description: 'Route HTML payload: { html, contentType, statusCode }.',
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
