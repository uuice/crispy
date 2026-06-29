import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { isEditor } from '../access/roles'
import { adminLabels } from '@/i18n/admin-labels'
import { chineseSlugField } from '@/fields/chineseSlugField'
import { withAiTextField } from '@/fields/ai'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: adminLabels.categories,
  access: {
    create: isEditor,
    delete: isEditor,
    read: anyone,
    update: isEditor,
  },
  admin: {
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
