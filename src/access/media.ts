import type { Access } from 'payload'

import { can } from './can'

/** Authors may upload media for posts; only editors can delete. */
export const mediaCreateAccess: Access = async ({ req }) => can(req.user, 'media:create', req)

export const mediaUpdateAccess: Access = async ({ req }) => can(req.user, 'media:update', req)

export const mediaDeleteAccess: Access = async ({ req }) => can(req.user, 'media:delete', req)
