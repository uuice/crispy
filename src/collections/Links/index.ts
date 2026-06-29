import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { isEditor } from '../../access/roles'
import { adminLabels } from '@/i18n/admin-labels'

import { revalidateLinks, revalidateLinksDelete } from './hooks/revalidateLinks'

export const Links: CollectionConfig = {
  slug: 'links',
  labels: adminLabels.links,
  access: {
    create: isEditor,
    delete: isEditor,
    read: anyone,
    update: isEditor,
  },
  admin: {
    defaultColumns: ['title', 'url', 'sort', 'enabled', 'updatedAt'],
    useAsTitle: 'title',
    group: adminLabels.contentGroup,
  },
  defaultSort: 'sort',
  hooks: {
    afterChange: [revalidateLinks],
    afterDelete: [revalidateLinksDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: adminLabels.title,
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      label: adminLabels.url,
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: adminLabels.description,
    },
    {
      name: 'logo',
      type: 'upload',
      label: adminLabels.logo,
      relationTo: 'media',
    },
    {
      name: 'sort',
      type: 'number',
      label: adminLabels.sort,
      defaultValue: 0,
      admin: {
        description: 'Lower numbers appear first.',
      },
    },
    {
      name: 'enabled',
      type: 'checkbox',
      label: adminLabels.enabled,
      defaultValue: true,
    },
    {
      name: 'openInNewTab',
      type: 'checkbox',
      label: adminLabels.openInNewTab,
      defaultValue: true,
    },
  ],
}
