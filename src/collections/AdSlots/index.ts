import type { CollectionConfig } from 'payload'
import { chineseSlugField } from '@/fields/chineseSlugField'

import { anyone } from '../../access/anyone'
import { isEditor } from '../../access/roles'
import { adminLabels } from '@/i18n/admin-labels'
import { aiSuggestAssistField, withAiTextField, withAiTextareaField } from '@/fields/ai'

import { revalidateAdSlots, revalidateAdSlotsDelete } from './hooks/revalidateAdSlots'

export const AdSlots: CollectionConfig = {
  slug: 'ad-slots',
  labels: adminLabels.adSlots,
  access: {
    create: isEditor,
    delete: isEditor,
    read: anyone,
    update: isEditor,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'enabled', 'updatedAt'],
    useAsTitle: 'title',
    group: adminLabels.operationsGroup,
  },
  defaultSort: 'title',
  hooks: {
    afterChange: [revalidateAdSlots],
    afterDelete: [revalidateAdSlotsDelete],
  },
  fields: [
    withAiTextField({
      name: 'title',
      type: 'text',
      label: adminLabels.title,
      required: true,
    }),
    chineseSlugField({
      position: undefined,
      admin: {
        description: '前台 AdSlot 组件使用的标识，如 home-banner、post-content-bottom',
      },
    }),
    aiSuggestAssistField({ contentFieldPaths: 'description' }),
    withAiTextareaField(
      {
        name: 'description',
        type: 'textarea',
        label: adminLabels.description,
      },
      { contentFieldPaths: 'description' },
    ),
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
