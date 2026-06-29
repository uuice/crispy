import type { Access } from 'payload'

import { authenticatedOrPublished } from './authenticatedOrPublished'
import { hasRole } from './roles'

export const postsReadAccess = authenticatedOrPublished

export const postsCreateAccess: Access = ({ req: { user } }) =>
  hasRole(user, ['super-admin', 'editor', 'author'])

export const postsUpdateAccess: Access = ({ req: { user } }) => {
  if (hasRole(user, ['super-admin', 'editor'])) return true
  if (hasRole(user, ['author']) && user) {
    return { authors: { contains: user.id } }
  }
  return false
}

export const postsDeleteAccess: Access = ({ req: { user } }) =>
  hasRole(user, ['super-admin', 'editor'])
