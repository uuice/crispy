import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { adminLabels } from '@/i18n/admin-labels'
import { chineseSlugField } from '@/fields/chineseSlugField'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: adminLabels.categories,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: adminLabels.title,
      required: true,
    },
    chineseSlugField({
      position: undefined,
    }),
  ],
}
