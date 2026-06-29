import type { Access } from 'payload'

import { hasRole, isEditor } from './roles'

export const pagesCreateAccess: Access = isEditor

export const pagesUpdateAccess: Access = isEditor

export const pagesDeleteAccess: Access = isEditor

/** Editors see drafts; authors and public only see published pages. */
export const pagesReadAccess: Access = ({ req: { user } }) => {
  if (hasRole(user, ['super-admin', 'editor'])) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
