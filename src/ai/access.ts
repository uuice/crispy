import type { Payload, PayloadRequest } from 'payload'

import { can, canAny } from '@/access/can'
import { isAiEnabledCollection } from '@/ai/collectionProfiles'
import type { User } from '@/payload-types'

export async function canUseAi(
  user: PayloadRequest['user'],
  reqOrPayload: PayloadRequest | Payload,
): Promise<boolean> {
  return can(user, 'ai:use', reqOrPayload)
}

export async function assertAiAccess(
  req: PayloadRequest,
  collection: string,
  docId?: string | number,
) {
  if (!(await canUseAi(req.user, req))) {
    throw new Error('无权使用 AI 功能')
  }

  if (!isAiEnabledCollection(collection)) {
    throw new Error('该内容类型未启用 AI')
  }

  const user = req.user as User

  if (await canAny(user, ['posts:update:any', 'pages:manage'], req)) {
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
