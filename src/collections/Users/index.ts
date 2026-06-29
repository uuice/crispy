import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { CRISPY_ROLES, isSuperAdmin } from '../../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: isSuperAdmin,
    delete: isSuperAdmin,
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
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      defaultValue: ['author'],
      required: true,
      options: CRISPY_ROLES,
      access: {
        update: isSuperAdmin,
      },
    },
  ],
  timestamps: true,
}
