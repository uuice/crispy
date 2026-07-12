import type { Access } from 'payload'

import { authenticatedOrPublished } from './authenticatedOrPublished'
import { hasRole } from './roles'

export const novelChaptersReadAccess = authenticatedOrPublished

export const novelChaptersWriteAccess: Access = ({ req: { user } }) =>
  hasRole(user, ['super-admin', 'editor'])
