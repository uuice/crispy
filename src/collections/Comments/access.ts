import type { Access } from 'payload'

import { hasRole } from '@/access/roles'
import { resolveCommentSettings } from '@/comments/settings'

export const commentsReadAccess: Access = ({ req: { user } }) => {
  if (hasRole(user, ['super-admin', 'editor'])) return true

  return {
    status: {
      equals: 'approved',
    },
  }
}

export const commentsCreateAccess: Access = async ({ req: { user } }) => {
  const settings = await resolveCommentSettings()
  if (!settings.enabled) return false
  if (user) return true
  return settings.allowGuestComments
}

export const commentsUpdateAccess: Access = ({ req: { user } }) =>
  hasRole(user, ['super-admin', 'editor'])

export const commentsDeleteAccess: Access = ({ req: { user } }) =>
  hasRole(user, ['super-admin', 'editor'])
