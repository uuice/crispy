import type { PayloadRequest } from 'payload'

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

  if (!docId || collection !== 'posts') return

  const user = req.user as User
  if (hasRole(user, ['super-admin', 'editor'])) return

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
