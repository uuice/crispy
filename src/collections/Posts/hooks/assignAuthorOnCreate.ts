import type { CollectionBeforeChangeHook } from 'payload'

import type { Post } from '@/payload-types'

export const assignAuthorOnCreate: CollectionBeforeChangeHook<Post> = ({
  data,
  operation,
  req,
}) => {
  if (operation === 'create' && req.user) {
    const authors = data.authors
    if (!authors || (Array.isArray(authors) && authors.length === 0)) {
      data.authors = [req.user.id]
    }
  }
  return data
}
