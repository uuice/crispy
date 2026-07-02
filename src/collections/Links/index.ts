import type { CollectionConfig } from 'payload'

import { enabledPublicReadAccess } from '../../access/enabledPublicRead'
import { isEditor } from '../../access/roles'
import { adminLabels } from '@/i18n/admin-labels'
import { aiSuggestAssistField, withAiTextField, withAiTextareaField } from '@/fields/ai'

export const Links: CollectionConfig = {
  slug: 'links',
  labels: adminLabels.links,
  access: {
    create: isEditor,
    delete: isEditor,
    read: enabledPublicReadAccess,
    update: isEditor,
  },
  admin: {
    defaultColumns: ['title', 'url', 'sort', 'enabled', 'updatedAt'],
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
