import type { Access } from 'payload'

import { can } from './can'

/** Staff see all novels; public sees only enabled novels. */
export const novelsReadAccess: Access = async ({ req }) => {
  if (await can(req.user, 'novels:read:all', req)) {
    return true
  }

  return {
    enabled: {
      equals: true,
    },
  }
}

export const novelsWriteAccess: Access = async ({ req }) => can(req.user, 'novels:manage', req)
