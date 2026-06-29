import type { CollectionConfig } from 'payload'

import { isEditor } from '../../access/roles'
import { adminLabels } from '@/i18n/admin-labels'

import { galleryItemsReadAccess } from './access'
import { revalidateGalleryItems, revalidateGalleryItemsDelete } from './hooks/revalidateGalleryItems'

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
    defaultColumns: ['title', 'image', 'sort', 'enabled', 'updatedAt'],
    useAsTitle: 'title',
    group: adminLabels.contentGroup,
    description: 'Curated images shown on the public /gallery page. Media library items are not listed until added here.',
  },
  defaultSort: 'sort',
  hooks: {
    afterChange: [revalidateGalleryItems],
    afterDelete: [revalidateGalleryItemsDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: adminLabels.title,
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      label: adminLabels.galleryImage,
      relationTo: 'media',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: adminLabels.description,
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
        description: 'Only enabled items appear on the public gallery page.',
        position: 'sidebar',
      },
    },
  ],
}
