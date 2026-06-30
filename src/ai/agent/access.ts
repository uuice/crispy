import type { PayloadRequest } from 'payload'

import { hasRole } from '@/access/roles'
import { canUseAi } from '@/ai/access'
import { isAgentCollection } from '@/ai/agent/resources'
import type { User } from '@/payload-types'

export function canUseAiAgent(user: PayloadRequest['user']): boolean {
  return canUseAi(user)
}

export async function assertAgentCollectionAccess(
  req: PayloadRequest,
  collection: string,
  operation: 'read' | 'create' | 'update' | 'delete',
  docId?: string | number,
): Promise<void> {
  if (!canUseAiAgent(req.user)) {
    throw new Error('无权使用 AI 助手')
  }

  if (!isAgentCollection(collection)) {
    throw new Error(`不支持的内容类型：${collection}`)
  }

  if (collection === 'media' && operation === 'delete') {
    throw new Error('媒体文件不允许通过 AI 助手删除')
  }

  const user = req.user as User

  if (hasRole(user, ['super-admin', 'editor'])) {
    return
  }

  // Authors may only manage their own posts
  if (collection !== 'posts') {
    throw new Error('作者仅可通过 AI 助手管理自己的文章')
  }

  if (operation === 'create') {
    return
  }

  if (!docId) {
    throw new Error('缺少文档 ID')
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
    throw new Error('只能管理自己创建的文章')
  }
}

export async function assertAgentGlobalAccess(req: PayloadRequest): Promise<void> {
  if (!canUseAiAgent(req.user)) {
    throw new Error('无权使用 AI 助手')
  }

  if (!hasRole(req.user, ['super-admin', 'editor'])) {
    throw new Error('仅管理员和编辑可通过 AI 助手修改全局配置')
  }
}
