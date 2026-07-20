import type { Access } from 'payload'

import { can } from '@/access/can'
import { resolveCommentSettings } from '@/comments/settings'

export const commentsReadAccess: Access = async ({ req }) => {
  if (await can(req.user, 'comments:moderate', req)) return true

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

export const commentsUpdateAccess: Access = async ({ req }) => can(req.user, 'comments:moderate', req)

export const commentsDeleteAccess: Access = async ({ req }) => can(req.user, 'comments:moderate', req)
