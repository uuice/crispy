import type { Access, CollectionConfig } from 'payload'

import { userHasRole } from '@/access/roles'
import { canUseAiAgent } from '@/ai/agent/access'
import { adminLabels } from '@/i18n/admin-labels'

export const AI_CHAT_SESSION_SLUG = 'ai-chat-sessions' as const

const canAccessAiChatSessions: Access = async ({ req }) => {
  if (!req.user) return false
  return canUseAiAgent(req.user, req)
}

const ownSessionOrSuperAdmin: Access = async ({ req }) => {
  if (!req.user) return false
  if (await userHasRole(req.user, ['super-admin'], req.payload, req)) return true
  return { user: { equals: req.user.id } }
}

export const AiChatSessions: CollectionConfig = {
  slug: AI_CHAT_SESSION_SLUG,
  labels: adminLabels.aiChatSessions,
  access: {
    create: canAccessAiChatSessions,
    read: ownSessionOrSuperAdmin,
    update: ownSessionOrSuperAdmin,
    delete: ownSessionOrSuperAdmin,
  },
  admin: {
    defaultColumns: ['title', 'user', 'lastMessageAt', 'updatedAt'],
    useAsTitle: 'title',
    group: adminLabels.systemGroup,
    description: 'AI 内容助手完整会话历史，由聊天 API 自动写入。也可从运营 → AI 内容助手进入。',
  },
  defaultSort: '-lastMessageAt',
  timestamps: true,
  fields: [
    {
      name: 'title',
      type: 'text',
      label: adminLabels.aiChatSessionTitle,
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      label: adminLabels.aiChatSessionUser,
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'lastMessageAt',
      type: 'date',
      label: adminLabels.aiChatSessionLastMessageAt,
      required: true,
      index: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'messages',
      type: 'json',
      label: adminLabels.aiChatSessionMessages,
      required: true,
      admin: {
        description: '完整对话记录（用户消息、AI 回复、工具调用摘要）。',
      },
    },
  ],
}
