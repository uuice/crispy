import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { hideUnlessAnyPermission } from '@/access/adminHidden'
import { requirePermission } from '@/access/can'
import { adminLabels } from '@/i18n/admin-labels'
import { chineseSlugField } from '@/fields/chineseSlugField'
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
    {
      name: 'title',
      type: 'text',
      label: adminLabels.title,
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: adminLabels.description,
    },
    chineseSlugField({
      position: undefined,
    }),
  ],
}
