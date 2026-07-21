import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { hideUnlessAnyPermission } from '@/access/adminHidden'
import { requirePermission } from '@/access/can'
import { adminLabels } from '@/i18n/admin-labels'
import { chineseSlugField } from '@/fields/chineseSlugField'
import { aiSuggestAssistField, withAiTextField, withAiTextareaField } from '@/fields/ai'

export const NovelTags: CollectionConfig<'novel-tags'> = {
  slug: 'novel-tags',
  labels: adminLabels.novelTags,
  access: {
    create: requirePermission('taxonomy:manage'),
    delete: requirePermission('taxonomy:manage'),
    read: anyone,
    update: requirePermission('taxonomy:manage'),
  },
  admin: {
    group: adminLabels.novelGroup,
    defaultColumns: ['title', 'slug', 'updatedAt'],
    useAsTitle: 'title',
    description: '小说专用标签，与博客 tags 独立。',
    hidden: hideUnlessAnyPermission('taxonomy:manage'),
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
