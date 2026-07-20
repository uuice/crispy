import type { Access } from 'payload'

import { can } from './can'

/** Anonymous users only see enabled records; editors and above see all. */
export const enabledPublicReadAccess: Access = async ({ req }) => {
  if (await can(req.user, 'ops:manage', req)) {
    return true
  }

  return {
    enabled: {
      equals: true,
    },
  }
}
