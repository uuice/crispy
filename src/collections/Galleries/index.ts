import type { CollectionConfig } from 'payload'

import { isEditor } from '../../access/roles'
import { adminLabels } from '@/i18n/admin-labels'
import { chineseSlugField } from '@/fields/chineseSlugField'
import { withAiTextField, withAiTextareaField } from '@/fields/ai'

import { galleriesReadAccess } from './access'

export const Galleries: CollectionConfig = {
  slug: 'galleries',
  labels: adminLabels.galleries,
  access: {
    create: isEditor,
    delete: isEditor,
    read: galleriesReadAccess,
    update: isEditor,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'sort', 'enabled', 'updatedAt'],
    useAsTitle: 'title',
    group: adminLabels.contentGroup,
    description:
      '图库相册（主实体）。每本图库可包含多条 gallery-items 图片；前台路径 /galleries/{slug}。',
  },
  defaultSort: 'sort',
  fields: [
    withAiTextField({
      name: 'title',
      type: 'text',
      label: adminLabels.title,
      required: true,
    }),
    chineseSlugField(),
    withAiTextareaField({
      name: 'description',
      type: 'textarea',
      label: adminLabels.description,
    }),
    {
      name: 'cover',
      type: 'upload',
      label: adminLabels.galleryCover,
      relationTo: 'media',
      admin: {
        description: 'Optional cover shown on the galleries list.',
      },
    },
    {
      name: 'sort',
      type: 'number',
      label: adminLabels.sort,
      defaultValue: 0,
      admin: {
        description: 'Lower numbers appear first.',
        position: 'sidebar',
      },
    },
    {
      name: 'enabled',
      type: 'checkbox',
      label: adminLabels.enabled,
      defaultValue: true,
      admin: {
        description: 'Only enabled galleries appear on the public site.',
        position: 'sidebar',
      },
    },
  ],
}
