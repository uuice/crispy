import type { CollectionConfig } from 'payload'

import { enabledPublicReadAccess } from '../../access/enabledPublicRead'
import { requirePermission } from '@/access/can'
import { adminLabels } from '@/i18n/admin-labels'
import { hideUnlessAnyPermission } from '@/access/adminHidden'

export const Ads: CollectionConfig = {
  slug: 'ads',
  labels: adminLabels.ads,
  access: {
    create: requirePermission('ops:manage'),
    delete: requirePermission('ops:manage'),
    read: enabledPublicReadAccess,
    update: requirePermission('ops:manage'),
  },
  admin: {
    hidden: hideUnlessAnyPermission('ops:manage'),
    defaultColumns: ['title', 'slot', 'format', 'sort', 'enabled', 'updatedAt'],
    useAsTitle: 'title',
    group: adminLabels.operationsGroup,
  },
  defaultSort: 'sort',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: adminLabels.title,
      required: true,
      admin: {
        description: '仅后台管理用，不展示在前台',
      },
    },
    {
      name: 'slot',
      type: 'relationship',
      label: adminLabels.adSlot,
      relationTo: 'ad-slots',
      required: true,
    },
    {
      name: 'format',
      type: 'select',
      label: adminLabels.adFormat,
      required: true,
      defaultValue: 'image',
      options: [
        { label: adminLabels.adFormatImage, value: 'image' },
        { label: adminLabels.adFormatHtml, value: 'html' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      label: adminLabels.adImage,
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData?.format === 'image',
      },
    },
    {
      name: 'html',
      type: 'textarea',
      label: adminLabels.adHtml,
      admin: {
        condition: (_, siblingData) => siblingData?.format === 'html',
        description: 'Raw HTML snippet (trusted editors only).',
      },
    },
    {
      name: 'link',
      type: 'text',
      label: adminLabels.url,
      admin: {
        condition: (_, siblingData) => siblingData?.format === 'image',
      },
    },
    {
      name: 'alt',
      type: 'text',
      label: adminLabels.alt,
      admin: {
        condition: (_, siblingData) => siblingData?.format === 'image',
      },
    },
    {
      name: 'sort',
      type: 'number',
      label: adminLabels.sort,
      defaultValue: 0,
      admin: {
        description: 'Lower numbers have higher priority within the same slot.',
      },
    },
    {
      name: 'startAt',
      type: 'date',
      label: adminLabels.startAt,
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'endAt',
      type: 'date',
      label: adminLabels.endAt,
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'enabled',
      type: 'checkbox',
      label: adminLabels.enabled,
      defaultValue: true,
    },
    {
      name: 'openInNewTab',
      type: 'checkbox',
      label: adminLabels.openInNewTab,
      defaultValue: true,
      admin: {
        condition: (_, siblingData) => siblingData?.format === 'image',
      },
    },
  ],
}
