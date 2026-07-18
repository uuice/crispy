import type { CollectionConfig } from 'payload'

import { isEditor } from '../../access/roles'
import { adminLabels } from '@/i18n/admin-labels'
import { aiSuggestAssistField, withAiTextField, withAiTextareaField } from '@/fields/ai'

import { galleryItemsReadAccess } from './access'

export const GalleryItems: CollectionConfig = {
  slug: 'gallery-items',
  labels: adminLabels.galleryItems,
  access: {
    create: isEditor,
    delete: isEditor,
    read: galleryItemsReadAccess,
    update: isEditor,
  },
  admin: {
    defaultColumns: ['title', 'gallery', 'image', 'sort', 'enabled', 'updatedAt'],
    useAsTitle: 'title',
    group: adminLabels.contentGroup,
    description:
      '图库内的单张图片条目。必须归属一本 galleries；Media 库中的文件不会自动出现在前台。',
  },
  defaultSort: 'sort',
  fields: [
    {
      name: 'gallery',
      type: 'relationship',
      label: adminLabels.galleryParent,
      relationTo: 'galleries',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    withAiTextField({
      name: 'title',
      type: 'text',
      label: adminLabels.title,
      required: true,
    }),
    {
      name: 'image',
      type: 'upload',
      label: adminLabels.galleryImage,
      relationTo: 'media',
      required: true,
    },
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
      name: 'sort',
      type: 'number',
      label: adminLabels.sort,
      defaultValue: 0,
      admin: {
        description: 'Lower numbers appear first within the gallery.',
        position: 'sidebar',
      },
    },
    {
      name: 'enabled',
      type: 'checkbox',
      label: adminLabels.enabled,
      defaultValue: true,
      admin: {
        description: 'Only enabled items appear inside a public gallery.',
        position: 'sidebar',
      },
    },
  ],
}
