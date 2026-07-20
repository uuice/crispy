import type { CollectionConfig } from 'payload'

import { requirePermission } from '@/access/can'
import { adminLabels } from '@/i18n/admin-labels'
import { aiSuggestAssistField, withAiTextField, withAiTextareaField } from '@/fields/ai'

import { galleryItemsReadAccess } from './access'
import { fillGalleryItemTitleFromMedia } from './hooks/fillTitleFromMedia'

export const GalleryItems: CollectionConfig = {
  slug: 'gallery-items',
  labels: adminLabels.galleryItems,
  access: {
    create: requirePermission('ops:manage'),
    delete: requirePermission('ops:manage'),
    read: galleryItemsReadAccess,
    update: requirePermission('ops:manage'),
  },
  admin: {
    defaultColumns: ['title', 'gallery', 'image', 'sort', 'enabled', 'updatedAt'],
    useAsTitle: 'title',
    group: adminLabels.contentGroup,
    description:
      '图库内的单张图片。建议在「图库」编辑页用「批量添加图片」或下方图片列表操作；列表可按所属图库筛选。',
    listSearchableFields: ['title', 'description'],
  },
  defaultSort: 'sort',
  fields: [
    {
      name: 'gallery',
      type: 'relationship',
      label: adminLabels.galleryParent,
      relationTo: 'galleries',
      required: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    withAiTextField(
      {
        name: 'title',
        type: 'text',
        label: adminLabels.title,
        hooks: {
          beforeValidate: [fillGalleryItemTitleFromMedia],
        },
        admin: {
          description: '可空；空则保存时用媒体 alt / 文件名。',
        },
      },
    ),
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
