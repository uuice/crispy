import type { GlobalConfig } from 'payload'

import { requireAnyPermission, requirePermission } from '@/access/can'
import { adminLabels } from '@/i18n/admin-labels'

/**
 * AI runtime defaults (Active layer).
 * Catalog: llm-providers + prompt-templates collections.
 */
export const AiSettings: GlobalConfig = {
  slug: 'ai-settings',
  label: adminLabels.aiSettings,
  access: {
    read: requireAnyPermission(['settings:ai', 'settings:site', 'catalog:prompts:read']),
    update: requirePermission('settings:ai'),
  },
  admin: {
    group: adminLabels.configGroup,
    description:
      '全局 AI 开关与默认模型。聊天 / Embedding 端点在「LLM 提供商」维护（capabilities）；Prompt 在「Prompt 模板」。密钥加密入库，不使用 .env。详见 docs/dev-docs.md#config-center',
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: adminLabels.aiEnabled,
      defaultValue: true,
      admin: {
        description: '关闭后 Agent / 前台助手均不可用。',
      },
    },
    {
      name: 'defaultProvider',
      type: 'relationship',
      relationTo: 'llm-providers',
      label: adminLabels.defaultLlmProvider,
      filterOptions: {
        enabled: { equals: true },
        capabilities: { contains: 'chat' },
      },
      admin: {
        description: '全局默认聊天 LLM（多选一）。未配置则 Agent / 助手不可用。',
      },
    },
    {
      name: 'defaultModel',
      type: 'text',
      label: adminLabels.aiDefaultModel,
      admin: {
        description: '可空 = 使用所选 Provider 的 defaultModel',
      },
    },
    {
      name: 'defaultEmbeddingProvider',
      type: 'relationship',
      relationTo: 'llm-providers',
      label: adminLabels.defaultEmbeddingProvider,
      filterOptions: {
        enabled: { equals: true },
        capabilities: { contains: 'embedding' },
      },
      admin: {
        description:
          '语义搜索 Active。Provider 须勾选 embedding，并设置 embeddingDimensions（当前库表 vector(1024)）。',
      },
    },
    {
      name: 'defaultEmbeddingModel',
      type: 'text',
      label: adminLabels.defaultEmbeddingModel,
      admin: {
        description: '可空 = 使用 Embedding Provider 的 defaultModel',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'temperature',
          type: 'number',
          label: adminLabels.aiTemperature,
          defaultValue: 0.7,
          min: 0,
          max: 2,
          admin: { width: '50%', step: 0.1 },
        },
        {
          name: 'maxTokens',
          type: 'number',
          label: adminLabels.aiMaxTokens,
          defaultValue: 2048,
          min: 256,
          max: 8192,
          admin: { width: '50%', step: 256 },
        },
      ],
    },
  ],
}
