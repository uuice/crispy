import type { CollectionConfig } from 'payload'

import { isEditor } from '../../access/roles'
import { adminLabels } from '@/i18n/admin-labels'
import { chineseSlugField } from '@/fields/chineseSlugField'
import { withAiTextField, withAiTextareaField } from '@/fields/ai'

import { galleriesReadAccess } from './access'
import {
  stashGalleryBulkImagesBeforeChange,
  syncGalleryBulkImagesAfterChange,
} from './hooks/syncGalleryBulkImagesAfterChange'

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
      '图库相册（主实体）。可批量选图保存；图片条目在下方「图片」列表，前台路径 /galleries/{slug}。',
  },
  defaultSort: 'sort',
  hooks: {
    beforeChange: [stashGalleryBulkImagesBeforeChange],
    afterChange: [syncGalleryBulkImagesAfterChange],
  },
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
        description: 'Optional cover shown on the galleries list. Empty → first image.',
        components: {
          Field: '@/components/Galleries/GalleryCoverUploadField',
        },
      },
    },
    {
      name: 'bulkImages',
      type: 'upload',
      label: adminLabels.galleryBulkImages,
      relationTo: 'media',
      hasMany: true,
      admin: {
        description:
          '批量选择媒体库图片后保存：自动生成图库图片条目（标题取自 alt/文件名），本字段会清空。已存在的图会跳过。',
      },
    },
    {
      name: 'items',
      type: 'join',
      label: adminLabels.galleryItemsJoin,
      collection: 'gallery-items',
      on: 'gallery',
      admin: {
        defaultColumns: ['title', 'image', 'sort', 'enabled', 'updatedAt'],
        allowCreate: true,
        components: {
          Field: '@/components/Galleries/GalleryItemsJoinField',
        },
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
