import type { CollectionConfig } from 'payload'

import { requirePermission } from '@/access/can'
import { encryptedTextField } from '@/fields/encryptedText'
import { adminLabels } from '@/i18n/admin-labels'

export const LlmProviders: CollectionConfig = {
  slug: 'llm-providers',
  labels: adminLabels.llmProviders,
  access: {
    create: requirePermission('catalog:secrets'),
    delete: requirePermission('catalog:secrets'),
    read: requirePermission('catalog:secrets'),
    update: requirePermission('catalog:secrets'),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'defaultModel', 'enabled', 'updatedAt'],
    group: adminLabels.configGroup,
    description:
      'OpenAI 兼容端点 Catalog。DeepSeek / OpenAI / 自定义网关均可添加入口；capabilities 勾选 chat 或 embedding；在 AI 设置中分别选默认聊天 / Embedding 提供商，或在 Prompt 模板上绑定。',
  },
  versions: false,
  trash: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: adminLabels.title,
      required: true,
      admin: {
        description: '显示名称，如 DeepSeek、Aliyun Embedding',
      },
    },
    {
      name: 'baseUrl',
      type: 'text',
      label: adminLabels.aiBaseUrl,
      required: true,
      admin: {
        description:
          'OpenAI 兼容 API 根地址，不含末尾 /v1（代码会自动拼接）。例：https://api.deepseek.com 或 …/compatible-mode',
      },
    },
    encryptedTextField({
      name: 'apiKey',
      label: adminLabels.apiKey,
      required: true,
      admin: {
        description: 'API Key（加密存储；留空或保持掩码则不修改）',
      },
    }),
    {
      name: 'models',
      type: 'array',
      label: adminLabels.aiModels,
      labels: {
        singular: adminLabels.aiModel,
        plural: adminLabels.aiModels,
      },
      admin: {
        description: '该端点可用模型列表；可为空（仅用 defaultModel）',
      },
      fields: [
        {
          name: 'modelId',
          type: 'text',
          label: 'Model ID',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          label: adminLabels.title,
        },
      ],
    },
    {
      name: 'defaultModel',
      type: 'text',
      label: adminLabels.aiDefaultModel,
      required: true,
      admin: {
        description: '未指定 model 时使用的默认模型 id',
      },
    },
    {
      name: 'capabilities',
      type: 'select',
      label: adminLabels.aiCapabilities,
      hasMany: true,
      defaultValue: ['chat'],
      options: [
        { label: 'Chat', value: 'chat' },
        { label: 'Embedding', value: 'embedding' },
      ],
      admin: {
        description: '该端点支持的能力；Agent / 前台助手需 chat；语义搜索需 embedding',
      },
    },
    {
      name: 'embeddingDimensions',
      type: 'number',
      label: adminLabels.embeddingDimensions,
      defaultValue: 1024,
      min: 64,
      max: 4096,
      admin: {
        description:
          '仅 embedding：输出向量维数，须与 content_embeddings.embedding（当前 vector(1024)）一致；改维需 DB 迁移。',
        condition: (_, siblingData) =>
          Array.isArray(siblingData?.capabilities) &&
          siblingData.capabilities.includes('embedding'),
      },
    },
    {
      name: 'enabled',
      type: 'checkbox',
      label: adminLabels.enabled,
      defaultValue: true,
    },
  ],
}
