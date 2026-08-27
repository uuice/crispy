import type { CollectionConfig } from 'payload'
import { chineseSlugField } from '@/fields/chineseSlugField'

import { enabledPublicReadAccess } from '../../access/enabledPublicRead'
import { requirePermission } from '@/access/can'
import { adminLabels } from '@/i18n/admin-labels'
import { hideUnlessAnyPermission } from '@/access/adminHidden'

export const AdSlots: CollectionConfig = {
  slug: 'ad-slots',
  labels: adminLabels.adSlots,
  access: {
    create: requirePermission('ops:manage'),
    delete: requirePermission('ops:manage'),
    read: enabledPublicReadAccess,
    update: requirePermission('ops:manage'),
  },
  admin: {
    hidden: hideUnlessAnyPermission('ops:manage'),
    defaultColumns: ['title', 'slug', 'enabled', 'updatedAt'],
    useAsTitle: 'title',
    group: adminLabels.operationsGroup,
  },
  defaultSort: 'title',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: adminLabels.title,
      required: true,
    },
    chineseSlugField({
      position: undefined,
      admin: {
        description: '前台 AdSlot 组件使用的标识，如 home-banner、post-content-bottom',
      },
    }),
    {
      name: 'description',
      type: 'textarea',
      label: adminLabels.description,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'recommendedWidth',
          type: 'number',
          label: adminLabels.recommendedWidth,
          admin: { width: '50%' },
        },
        {
          name: 'recommendedHeight',
          type: 'number',
          label: adminLabels.recommendedHeight,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'enabled',
      type: 'checkbox',
      label: adminLabels.enabled,
      defaultValue: true,
    },
  ],
}
