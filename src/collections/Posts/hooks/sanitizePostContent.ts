import type { CollectionBeforeValidateHook } from 'payload'

import { sanitizeLexicalBlocks } from '@/hooks/sanitizeLexicalBlocks'
import type { Post } from '@/payload-types'

export const sanitizePostContent: CollectionBeforeValidateHook<Post> = ({ data }) => {
  if (data?.content) {
    data.content = sanitizeLexicalBlocks(data.content)
  }
  return data
}
