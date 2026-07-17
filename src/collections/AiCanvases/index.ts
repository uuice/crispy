import type { Access, CollectionConfig } from 'payload'

import { canUseAiAgent } from '@/ai/agent/access'
import { hasRole } from '@/access/roles'
import { adminLabels } from '@/i18n/admin-labels'

export const AI_CANVAS_SLUG = 'ai-canvases' as const

const canAccessAiCanvases: Access = ({ req: { user } }) => {
  if (!user) return false
  return canUseAiAgent(user)
}

const ownCanvasOrSuperAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  if (hasRole(user, ['super-admin'])) return true
  return { user: { equals: user.id } }
}

export const AiCanvases: CollectionConfig = {
  slug: AI_CANVAS_SLUG,
  labels: adminLabels.aiCanvases,
  access: {
    create: canAccessAiCanvases,
    read: ownCanvasOrSuperAdmin,
    update: ownCanvasOrSuperAdmin,
    delete: ownCanvasOrSuperAdmin,
  },
  admin: {
    hidden: true,
    useAsTitle: 'title',
    defaultColumns: ['title', 'user', 'updatedAt'],
    description: 'AI 无限画布；按账号隔离，一人可创建多份。请从运营 → AI 画布进入。',
  },
  defaultSort: '-updatedAt',
  timestamps: true,
  trash: true,
  // Frequent autosave; skip version history (plugin respects explicit false).
  versions: false,
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        if (operation === 'create' && req.user && !data.user) {
          data.user = req.user.id
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: adminLabels.title,
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      label: adminLabels.aiChatSessionUser,
      relationTo: 'users',
      required: true,
      index: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'graph',
      type: 'json',
      label: adminLabels.aiCanvasGraph,
      required: true,
      defaultValue: {
        nodes: [],
        edges: [],
      },
      admin: {
        description: 'React Flow 节点与边（JSON）',
      },
    },
  ],
}
