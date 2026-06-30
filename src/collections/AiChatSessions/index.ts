import type { Access, CollectionConfig } from 'payload'

import { canUseAiAgent } from '@/ai/agent/access'
import { hasRole } from '@/access/roles'
import { adminLabels } from '@/i18n/admin-labels'

export const AI_CHAT_SESSION_SLUG = 'ai-chat-sessions' as const

const canAccessAiChatSessions: Access = ({ req: { user } }) => {
  if (!user) return false
  return canUseAiAgent(user)
}

const ownSessionOrSuperAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  if (hasRole(user, ['super-admin'])) return true
  return { user: { equals: user.id } }
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
    description: 'AI 内容助手完整会话历史，由聊天 API 自动写入。',
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
