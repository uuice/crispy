import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { CRISPY_ROLES, hasRole } from '../../access/roles'
import { adminLabels } from '@/i18n/admin-labels'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: adminLabels.users,
  access: {
    admin: authenticated,
    create: ({ req: { user } }) => hasRole(user, ['super-admin']),
    delete: ({ req: { user } }) => hasRole(user, ['super-admin']),
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
  },
  auth: {
    useAPIKey: true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: adminLabels.name,
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      defaultValue: ['author'],
      required: true,
      label: adminLabels.roles,
      options: CRISPY_ROLES,
      access: {
        update: ({ req: { user } }) => hasRole(user, ['super-admin']),
      },
    },
  ],
  timestamps: true,
}
