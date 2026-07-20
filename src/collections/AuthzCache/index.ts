import type { CollectionConfig } from 'payload'

import { requirePermission } from '@/access/can'
import { AUTHZ_CACHE_SLUG } from '@/access/collectionSlugs'
import { adminLabels } from '@/i18n/admin-labels'

export { AUTHZ_CACHE_SLUG }

export const AuthzCache: CollectionConfig = {
  slug: AUTHZ_CACHE_SLUG,
  labels: adminLabels.authzCache,
  access: {
    create: () => false,
    delete: requirePermission('roles:manage'),
    read: requirePermission('roles:manage'),
    update: () => false,
  },
  admin: {
    defaultColumns: ['cacheKey', 'scope', 'updatedAt'],
    useAsTitle: 'cacheKey',
    group: adminLabels.systemGroup,
    description: 'RBAC authz cache (role/user permissions). No TTL — overwritten on role/user changes.',
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
      admin: { readOnly: true },
    },
    {
      name: 'scope',
      type: 'select',
      label: adminLabels.authzCacheScope,
      required: true,
      options: [
        { label: adminLabels.authzCacheScopeUser, value: 'user' },
        { label: adminLabels.authzCacheScopeRole, value: 'role' },
      ],
      index: true,
      admin: { readOnly: true },
    },
    {
      name: 'cachedValue',
      type: 'json',
      label: adminLabels.cachePayload,
      admin: {
        description: 'user: { roleIds, roleSlugs, permissions }; role: { slug, permissions }',
        readOnly: true,
      },
    },
  ],
}
