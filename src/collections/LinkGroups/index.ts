import type { CollectionConfig } from 'payload'

import { enabledPublicReadAccess } from '../../access/enabledPublicRead'
import { requirePermission } from '@/access/can'
import { adminLabels } from '@/i18n/admin-labels'
import { withAiTextField, withAiTextareaField } from '@/fields/ai'
import { hideUnlessAnyPermission } from '@/access/adminHidden'

export const LinkGroups: CollectionConfig = {
  slug: 'link-groups',
  labels: adminLabels.linkGroups,
  access: {
    create: requirePermission('ops:manage'),
    delete: requirePermission('ops:manage'),
    read: enabledPublicReadAccess,
    update: requirePermission('ops:manage'),
  },
  admin: {
    hidden: hideUnlessAnyPermission('ops:manage'),
    defaultColumns: ['title', 'sort', 'enabled', 'updatedAt'],
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
    withAiTextareaField({
      name: 'description',
      type: 'textarea',
      label: adminLabels.description,
    }),
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
  ],
}
