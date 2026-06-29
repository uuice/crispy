import type { CollectionBeforeChangeHook } from 'payload'

import { hasRole } from '@/access/roles'
import type { Post } from '@/payload-types'

export const restrictAuthorPublish: CollectionBeforeChangeHook<Post> = ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' && operation !== 'update') return data
  if (!req.user) return data

  const isAuthorOnly =
    hasRole(req.user, ['author']) && !hasRole(req.user, ['editor', 'super-admin'])

  if (isAuthorOnly) {
    data._status = 'draft'
  }

  return data
}
