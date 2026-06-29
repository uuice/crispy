import type { Access } from 'payload'

import { hasRole } from '../../access/roles'

export const galleryItemsReadAccess: Access = ({ req: { user } }) => {
  if (hasRole(user, ['super-admin', 'editor'])) {
    return true
  }

  return {
    enabled: {
      equals: true,
    },
  }
}
