import type { Access } from 'payload'

import { authenticatedOrPublished } from './authenticatedOrPublished'
import { can } from './can'

export const novelChaptersReadAccess = authenticatedOrPublished

export const novelChaptersWriteAccess: Access = async ({ req }) => can(req.user, 'novels:manage', req)
