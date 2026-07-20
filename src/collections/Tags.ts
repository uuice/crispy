import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { requirePermission } from '@/access/can'
import { adminLabels } from '@/i18n/admin-labels'
import { chineseSlugField } from '@/fields/chineseSlugField'
import { aiSuggestAssistField, withAiTextField, withAiTextareaField } from '@/fields/ai'

export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: adminLabels.tags,
  access: {
    create: requirePermission('taxonomy:manage'),
    delete: requirePermission('taxonomy:manage'),
    read: anyone,
    update: requirePermission('taxonomy:manage'),
  },
  admin: {
    group: adminLabels.contentGroup,
    defaultColumns: ['title', 'slug', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    withAiTextField({
      name: 'title',
      type: 'text',
      label: adminLabels.title,
      required: true,
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
    chineseSlugField({
      position: undefined,
    }),
  ],
}
