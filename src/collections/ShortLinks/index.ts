import type { CollectionConfig } from 'payload'

import { enabledPublicReadAccess } from '../../access/enabledPublicRead'
import { requirePermission } from '@/access/can'
import { adminLabels } from '@/i18n/admin-labels'
import { withAiTextField } from '@/fields/ai'

function normalizeShortLinkSlug(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const normalized = value.trim().toLowerCase()
  return normalized.length > 0 ? normalized : undefined
}

export const ShortLinks: CollectionConfig = {
  slug: 'short-links',
  labels: adminLabels.shortLinks,
  access: {
    create: requirePermission('ops:manage'),
    delete: requirePermission('ops:manage'),
    read: enabledPublicReadAccess,
    update: requirePermission('ops:manage'),
  },
  admin: {
    defaultColumns: ['title', 'slug', 'targetUrl', 'enabled', 'updatedAt'],
    useAsTitle: 'title',
    group: adminLabels.operationsGroup,
  },
  defaultSort: '-updatedAt',
  fields: [
    withAiTextField({
      name: 'title',
      type: 'text',
      label: adminLabels.title,
      required: true,
    }),
    {
      name: 'slug',
      type: 'text',
      label: adminLabels.shortLinkSlug,
      required: true,
      unique: true,
      index: true,
      admin: {
        description: '短链接路径，如 gh 对应 /s/gh',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => normalizeShortLinkSlug(value),
        ],
      },
    },
    {
      name: 'targetUrl',
      type: 'text',
      label: adminLabels.targetUrl,
      required: true,
      admin: {
        description: '跳转目标，支持 https:// 外链或 /posts 等站内路径',
      },
    },
    {
      name: 'enabled',
      type: 'checkbox',
      label: adminLabels.enabled,
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
