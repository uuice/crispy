import type { Access } from 'payload'

import { can, requirePermission } from './can'

export const pagesCreateAccess: Access = requirePermission('pages:manage')

export const pagesUpdateAccess: Access = requirePermission('pages:manage')

export const pagesDeleteAccess: Access = requirePermission('pages:manage')

/** Users with pages:read:drafts see drafts; others only published. */
export const pagesReadAccess: Access = async ({ req }) => {
  if (await can(req.user, 'pages:read:drafts', req)) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
