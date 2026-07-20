import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { requirePermission } from '@/access/can'
import { adminLabels } from '@/i18n/admin-labels'
import { chineseSlugField } from '@/fields/chineseSlugField'
import { withAiTextField } from '@/fields/ai'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: adminLabels.categories,
  access: {
    create: requirePermission('taxonomy:manage'),
    delete: requirePermission('taxonomy:manage'),
    read: anyone,
    update: requirePermission('taxonomy:manage'),
  },
  admin: {
    group: adminLabels.contentGroup,
    useAsTitle: 'title',
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
    }),
  ],
}
