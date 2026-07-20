import type { CollectionBeforeChangeHook } from 'payload'

import { can } from '@/access/can'
import type { Post } from '@/payload-types'

export const restrictAuthorPublish: CollectionBeforeChangeHook<Post> = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' && operation !== 'update') return data
  if (!req.user) return data

  if (!(await can(req.user, 'posts:publish', req))) {
    data._status = 'draft'
  }

  return data
}
