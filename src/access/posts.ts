import type { Access } from 'payload'

import { authenticatedOrPublished } from './authenticatedOrPublished'
import { can } from './can'

export const postsReadAccess = authenticatedOrPublished

export const postsCreateAccess: Access = async ({ req }) => can(req.user, 'posts:create', req)

export const postsUpdateAccess: Access = async ({ req }) => {
  const { user } = req
  if (await can(user, 'posts:update:any', req)) return true
  if (user && (await can(user, 'posts:update:own', req))) {
    return { authors: { contains: user.id } }
  }
  return false
}

export const postsDeleteAccess: Access = async ({ req }) => can(req.user, 'posts:delete', req)
