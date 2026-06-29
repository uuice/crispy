import { Field } from 'payload'

import { adminLabels } from '@/i18n/admin-labels'

export const searchFields: Field[] = [
  {
    name: 'slug',
    type: 'text',
    label: adminLabels.slug,
    index: true,
    admin: {
      readOnly: true,
    },
  },
  {
    name: 'meta',
    label: adminLabels.seo,
    type: 'group',
    index: true,
    admin: {
      readOnly: true,
    },
    fields: [
      {
        type: 'text',
        name: 'title',
        label: adminLabels.title,
      },
      {
        type: 'text',
        name: 'description',
        label: adminLabels.description,
      },
      {
        name: 'image',
        label: adminLabels.imageField,
        type: 'upload',
        relationTo: 'media',
      },
    ],
  },
  {
    label: adminLabels.categoriesField,
    name: 'categories',
    type: 'array',
    admin: {
      readOnly: true,
    },
    fields: [
      {
        name: 'relationTo',
        type: 'text',
      },
      {
        name: 'categoryID',
        type: 'text',
      },
      {
        name: 'title',
        type: 'text',
      },
    ],
  },
]
