import type { CollectionConfig } from 'payload'

import { enabledPublicReadAccess } from '../../access/enabledPublicRead'
import { requirePermission } from '@/access/can'
import { adminLabels } from '@/i18n/admin-labels'
import { aiSuggestAssistField, withAiTextField, withAiTextareaField } from '@/fields/ai'

export const Links: CollectionConfig = {
  slug: 'links',
  labels: adminLabels.links,
  access: {
    create: requirePermission('ops:manage'),
    delete: requirePermission('ops:manage'),
    read: enabledPublicReadAccess,
    update: requirePermission('ops:manage'),
  },
  admin: {
    defaultColumns: ['title', 'group', 'url', 'sort', 'enabled', 'updatedAt'],
    useAsTitle: 'title',
    group: adminLabels.contentGroup,
  },
  defaultSort: 'sort',
  fields: [
    withAiTextField({
      name: 'title',
      type: 'text',
      label: adminLabels.title,
      required: true,
    }),
    {
      name: 'url',
      type: 'text',
      label: adminLabels.url,
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
      name: 'group',
      type: 'relationship',
      label: adminLabels.linkGroup,
      relationTo: 'link-groups',
      admin: {
        position: 'sidebar',
      },
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
