import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { isEditor } from '../access/roles'
import { adminLabels } from '@/i18n/admin-labels'
import { slugField } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: adminLabels.tags,
  access: {
    create: isEditor,
    delete: isEditor,
    read: anyone,
    update: isEditor,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    useAsTitle: 'title',
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
    slugField({
      position: undefined,
    }),
  ],
}
