import type { Access } from 'payload'

import { hasRole } from './roles'

/** Anonymous users only see enabled records; editors and above see all. */
export const enabledPublicReadAccess: Access = ({ req: { user } }) => {
  if (hasRole(user, ['super-admin', 'editor'])) {
    return true
  }

  return {
    enabled: {
      equals: true,
    },
  }
}
