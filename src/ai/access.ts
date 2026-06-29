import type { PayloadRequest } from 'payload'

import { isAiEnabledCollection } from '@/ai/collectionProfiles'
import { hasRole } from '@/access/roles'
import type { User } from '@/payload-types'

export function canUseAi(user: PayloadRequest['user']): boolean {
  if (!user || !('roles' in user)) return false
  return hasRole(user as User, ['super-admin', 'editor', 'author'])
}

export async function assertAiAccess(
  req: PayloadRequest,
  collection: string,
  docId?: string | number,
) {
  if (!canUseAi(req.user)) {
    throw new Error('无权使用 AI 功能')
  }

  if (!isAiEnabledCollection(collection)) {
    throw new Error('该内容类型未启用 AI')
  }

  const user = req.user as User

  if (hasRole(user, ['super-admin', 'editor'])) {
    return
  }

  if (collection !== 'posts' || !docId) {
    throw new Error('作者仅可在自己创建的文章上使用 AI')
  }

  const post = await req.payload.findByID({
    collection: 'posts',
    id: docId,
    depth: 0,
    overrideAccess: false,
    user,
  })

  const authorIds = (post.authors ?? []).map((a) => (typeof a === 'object' ? a.id : a))
  if (!authorIds.includes(user.id)) {
    throw new Error('只能对自己创建的文章使用 AI')
  }
}
