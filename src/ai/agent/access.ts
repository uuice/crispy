import type { Payload, PayloadRequest } from 'payload'

import { can, canAny } from '@/access/can'
import type { Permission } from '@/access/permissions'
import { canUseAi } from '@/ai/access'
import { isAgentCollection } from '@/ai/agent/resources'
import type { User } from '@/payload-types'

export async function canUseAiAgent(
  user: PayloadRequest['user'],
  reqOrPayload: PayloadRequest | Payload,
): Promise<boolean> {
  return canUseAi(user, reqOrPayload)
}

type AgentOp = 'read' | 'create' | 'update' | 'delete'

/** Collection → permissions required per operation (any-of). */
const COLLECTION_PERMISSIONS: Record<string, Partial<Record<AgentOp, Permission[]>>> = {
  posts: {
    read: ['posts:create', 'posts:update:own', 'posts:update:any'],
    create: ['posts:create'],
    update: ['posts:update:own', 'posts:update:any'],
    delete: ['posts:delete'],
  },
  pages: {
    read: ['pages:manage', 'pages:read:drafts'],
    create: ['pages:manage'],
    update: ['pages:manage'],
    delete: ['pages:manage'],
  },
  categories: {
    read: ['taxonomy:manage'],
    create: ['taxonomy:manage'],
    update: ['taxonomy:manage'],
    delete: ['taxonomy:manage'],
  },
  tags: {
    read: ['taxonomy:manage'],
    create: ['taxonomy:manage'],
    update: ['taxonomy:manage'],
    delete: ['taxonomy:manage'],
  },
  'novel-categories': {
    read: ['taxonomy:manage', 'novels:manage'],
    create: ['taxonomy:manage'],
    update: ['taxonomy:manage'],
    delete: ['taxonomy:manage'],
  },
  'novel-tags': {
    read: ['taxonomy:manage', 'novels:manage'],
    create: ['taxonomy:manage'],
    update: ['taxonomy:manage'],
    delete: ['taxonomy:manage'],
  },
  links: { read: ['ops:manage'], create: ['ops:manage'], update: ['ops:manage'], delete: ['ops:manage'] },
  'link-groups': {
    read: ['ops:manage'],
    create: ['ops:manage'],
    update: ['ops:manage'],
    delete: ['ops:manage'],
  },
  'ad-slots': {
    read: ['ops:manage'],
    create: ['ops:manage'],
    update: ['ops:manage'],
    delete: ['ops:manage'],
  },
  ads: { read: ['ops:manage'], create: ['ops:manage'], update: ['ops:manage'], delete: ['ops:manage'] },
  jobs: { read: ['ops:manage'], create: ['ops:manage'], update: ['ops:manage'], delete: ['ops:manage'] },
  galleries: {
    read: ['ops:manage'],
    create: ['ops:manage'],
    update: ['ops:manage'],
    delete: ['ops:manage'],
  },
  'gallery-items': {
    read: ['ops:manage'],
    create: ['ops:manage'],
    update: ['ops:manage'],
    delete: ['ops:manage'],
  },
  'short-links': {
    read: ['ops:manage'],
    create: ['ops:manage'],
    update: ['ops:manage'],
    delete: ['ops:manage'],
  },
  novels: {
    read: ['novels:read:all', 'novels:manage'],
    create: ['novels:manage'],
    update: ['novels:manage'],
    delete: ['novels:manage'],
  },
  'novel-chapters': {
    read: ['novels:read:all', 'novels:manage'],
    create: ['novels:manage'],
    update: ['novels:manage'],
    delete: ['novels:manage'],
  },
  media: {
    read: ['media:create', 'media:update', 'media:delete'],
    create: ['media:create'],
    update: ['media:update'],
    delete: ['media:delete'],
  },
  comments: {
    read: ['comments:moderate'],
    create: ['comments:moderate'],
    update: ['comments:moderate'],
    delete: ['comments:moderate'],
  },
  redirects: {
    read: ['ops:manage', 'pages:manage'],
    create: ['ops:manage', 'pages:manage'],
    update: ['ops:manage', 'pages:manage'],
    delete: ['ops:manage', 'pages:manage'],
  },
  forms: {
    read: ['ops:manage'],
    create: ['ops:manage'],
    update: ['ops:manage'],
    delete: ['ops:manage'],
  },
  'form-submissions': {
    read: ['ops:manage'],
    delete: ['ops:manage'],
  },
  'app-configs': {
    read: ['catalog:app-configs:read', 'catalog:app-configs:write'],
    create: ['catalog:app-configs:write'],
    update: ['catalog:app-configs:write'],
    delete: ['catalog:app-configs:write'],
  },
  'llm-providers': {
    read: ['catalog:secrets'],
    create: ['catalog:secrets'],
    update: ['catalog:secrets'],
    delete: ['catalog:secrets'],
  },
  'storage-targets': {
    read: ['catalog:secrets'],
    create: ['catalog:secrets'],
    update: ['catalog:secrets'],
    delete: ['catalog:secrets'],
  },
  'integration-credentials': {
    read: ['catalog:secrets'],
    create: ['catalog:secrets'],
    update: ['catalog:secrets'],
    delete: ['catalog:secrets'],
  },
  'email-transports': {
    read: ['catalog:secrets'],
    create: ['catalog:secrets'],
    update: ['catalog:secrets'],
    delete: ['catalog:secrets'],
  },
  'prompt-templates': {
    read: ['catalog:prompts:read', 'catalog:prompts:write'],
    create: ['catalog:prompts:write'],
    update: ['catalog:prompts:write'],
    delete: ['catalog:prompts:write'],
  },
  'payload-query-presets': {
    read: ['presets:manage'],
    create: ['presets:manage'],
    update: ['presets:manage'],
    delete: ['presets:manage'],
  },
}

const GLOBAL_UPDATE_PERMISSION: Record<string, Permission> = {
  header: 'settings:site',
  footer: 'settings:site',
  'site-settings': 'settings:site',
  'cache-settings': 'settings:site',
  'comment-settings': 'settings:comment',
  'ai-settings': 'settings:ai',
  'storage-settings': 'settings:storage',
  'integration-settings': 'settings:integration',
  'email-settings': 'settings:email',
}

const GLOBAL_READ_ANY: Permission[] = [
  'settings:site',
  'settings:comment',
  'settings:ai',
  'settings:storage',
  'settings:integration',
  'settings:email',
  'pages:manage',
  'ops:manage',
]

async function assertOwnPost(
  req: PayloadRequest,
  user: User,
  docId: string | number,
): Promise<void> {
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

/** Authors without posts:update:any may only touch their own posts via Agent. */
export async function canAgentAccessAnyPost(req: PayloadRequest): Promise<boolean> {
  return can(req.user, 'posts:update:any', req)
}

/** Where clause to restrict Agent list/search to the current user's posts. */
export function ownPostsWhere(userId: string | number): { authors: { contains: string | number } } {
  return { authors: { contains: userId } }
}

async function assertPostsOwnershipIfNeeded(
  req: PayloadRequest,
  user: User,
  operation: AgentOp,
  docId?: string | number,
): Promise<void> {
  if (await can(user, 'posts:update:any', req)) return

  if (operation === 'delete') {
    // Delete requires posts:delete; authors should not reach here without it.
    if (!(await can(user, 'posts:delete', req))) {
      throw new Error('无权删除文章')
    }
    return
  }

  if (operation === 'create') return

  // read / update: own posts only
  if (!(await can(user, 'posts:update:own', req)) && !(await can(user, 'posts:create', req))) {
    throw new Error('无权访问文章')
  }

  if (docId != null) {
    await assertOwnPost(req, user, docId)
  }
}

export async function assertAgentCollectionAccess(
  req: PayloadRequest,
  collection: string,
  operation: AgentOp,
  docId?: string | number,
): Promise<void> {
  if (!(await canUseAiAgent(req.user, req))) {
    throw new Error('无权使用 AI 助手')
  }

  if (!isAgentCollection(collection)) {
    throw new Error(`不支持的内容类型：${collection}`)
  }

  if (collection === 'media' && operation === 'delete') {
    throw new Error('媒体文件不允许通过 AI 助手删除')
  }

  if (collection === 'form-submissions' && (operation === 'create' || operation === 'update')) {
    throw new Error('表单提交记录不可通过 AI 助手创建或修改')
  }

  const user = req.user as User
  const required = COLLECTION_PERMISSIONS[collection]?.[operation]

  if (!required || required.length === 0) {
    throw new Error(`无权对 ${collection} 执行 ${operation}`)
  }

  if (!(await canAny(user, required, req))) {
    throw new Error(`无权对 ${collection} 执行 ${operation}`)
  }

  if (collection === 'posts') {
    await assertPostsOwnershipIfNeeded(req, user, operation, docId)
  }
}

export async function assertAgentGlobalAccess(
  req: PayloadRequest,
  slug?: string,
  operation: 'read' | 'update' = 'read',
): Promise<void> {
  if (!(await canUseAiAgent(req.user, req))) {
    throw new Error('无权使用 AI 助手')
  }

  if (operation === 'read') {
    if (slug && GLOBAL_UPDATE_PERMISSION[slug]) {
      const updatePermission = GLOBAL_UPDATE_PERMISSION[slug]
      if (await can(req.user, updatePermission, req)) return

      // Align with Admin global read: editors can read site + AI/comment settings (write still gated).
      if (
        (slug === 'header' ||
          slug === 'footer' ||
          slug === 'site-settings' ||
          slug === 'cache-settings') &&
        (await canAny(req.user, ['settings:site', 'ops:manage', 'pages:manage'], req))
      ) {
        return
      }

      if (
        slug === 'ai-settings' &&
        (await canAny(req.user, ['settings:site', 'catalog:prompts:read', 'pages:manage', 'ops:manage'], req))
      ) {
        return
      }

      if (
        slug === 'comment-settings' &&
        (await canAny(req.user, ['settings:site', 'comments:moderate', 'pages:manage', 'ops:manage'], req))
      ) {
        return
      }

      throw new Error(`无权读取全局配置：${slug}`)
    }

    if (!(await canAny(req.user, GLOBAL_READ_ANY, req))) {
      throw new Error('无权读取全局配置')
    }
    return
  }

  // update
  if (!slug) {
    throw new Error('缺少 Global slug')
  }

  const permission = GLOBAL_UPDATE_PERMISSION[slug]
  if (!permission) {
    throw new Error(`不支持的全局配置：${slug}`)
  }

  if (!(await can(req.user, permission, req))) {
    throw new Error(`无权更新全局配置：${slug}`)
  }
}

/** Frontend cache registry purge — same as /admin/cache. */
export async function assertAgentCacheAccess(req: PayloadRequest): Promise<void> {
  if (!(await canUseAiAgent(req.user, req))) {
    throw new Error('无权使用 AI 助手')
  }

  if (!(await can(req.user, 'cache:manage', req))) {
    throw new Error('仅具备 cache:manage 权限可通过 AI 助手管理前台缓存')
  }
}

/** Collection stats — same as /admin/stats. */
export async function assertAgentStatsAccess(req: PayloadRequest): Promise<void> {
  if (!(await canUseAiAgent(req.user, req))) {
    throw new Error('无权使用 AI 助手')
  }

  if (!(await can(req.user, 'stats:read', req))) {
    throw new Error('仅具备 stats:read 权限可通过 AI 助手查看内容统计')
  }
}

/** Audit logs — read-only. */
export async function assertAgentAuditLogAccess(req: PayloadRequest): Promise<void> {
  if (!(await canUseAiAgent(req.user, req))) {
    throw new Error('无权使用 AI 助手')
  }

  if (!(await can(req.user, 'logs:read', req))) {
    throw new Error('仅具备 logs:read 权限可通过 AI 助手查看审计日志')
  }
}
