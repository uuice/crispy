import type { Access } from 'payload'

import { hasRole } from './roles'

/** Editors see all novels; public sees only enabled novels. */
export const novelsReadAccess: Access = ({ req: { user } }) => {
  if (user && hasRole(user, ['super-admin', 'editor', 'author'])) {
    return true
  }

  return {
    enabled: {
      equals: true,
    },
  }
}

export const novelsWriteAccess: Access = ({ req: { user } }) =>
  hasRole(user, ['super-admin', 'editor'])
