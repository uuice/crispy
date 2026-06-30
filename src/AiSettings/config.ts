import type { GlobalConfig } from 'payload'

import { isEditor, isSuperAdmin } from '@/access/roles'
import { DEFAULT_AI_TEMPLATES } from '@/ai/defaultTemplates'
import {
  AI_PROVIDER_OPTIONS,
  AI_PROVIDER_PRESETS,
  parseAiProvider,
  type AiProvider,
} from '@/ai/providers/presets'
import { adminLabels } from '@/i18n/admin-labels'

function applyProviderPreset(provider: AiProvider): { model: string; baseUrl: string } {
  const preset = AI_PROVIDER_PRESETS[provider]
  return { model: preset.model, baseUrl: preset.baseUrl }
}

export const AiSettings: GlobalConfig = {
  slug: 'ai-settings',
  label: adminLabels.aiSettings,
  access: {
    read: isEditor,
    update: isSuperAdmin,
  },
  admin: {
    group: adminLabels.systemGroup,
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        const nextProvider = parseAiProvider(data?.provider ?? originalDoc?.provider)
        const prevProvider = parseAiProvider(originalDoc?.provider)

        if (nextProvider !== prevProvider) {
          const preset = applyProviderPreset(nextProvider)
          data.model = preset.model
          data.baseUrl = preset.baseUrl
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: adminLabels.aiEnabled,
      defaultValue: true,
      admin: {
        description:
          '关闭后 Admin 内 AI 按钮不可用。API Key 请在 .env 配置：DeepSeek 用 DEEPSEEK_API_KEY，OpenAI 用 OPENAI_API_KEY，或通用 LLM_API_KEY。',
      },
    },
    {
      name: 'provider',
      type: 'select',
      label: adminLabels.aiProvider,
      defaultValue: 'deepseek',
      options: AI_PROVIDER_OPTIONS,
      admin: {
        description: '选择上游 LLM 提供商；切换后会自动填充默认模型与 API 地址，可按需修改。',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'model',
          type: 'text',
          label: adminLabels.aiModel,
          defaultValue: 'deepseek-chat',
          admin: {
            width: '50%',
            description: '模型名称，取决于所选提供商',
          },
        },
        {
          name: 'baseUrl',
          type: 'text',
          label: adminLabels.aiBaseUrl,
          defaultValue: 'https://api.deepseek.com',
          admin: {
            width: '50%',
            description: 'OpenAI 兼容 API 根地址，不含 /v1 后缀',
          },
        },
      ],
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
    {
      name: 'promptTemplates',
      type: 'array',
      label: adminLabels.aiPromptTemplates,
      admin: {
        description: '留空则使用内置默认模板。id 与 action 需与系统约定一致。',
      },
      defaultValue: DEFAULT_AI_TEMPLATES,
      fields: [
        {
          name: 'id',
          type: 'text',
          label: 'ID',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          label: adminLabels.title,
          required: true,
        },
        {
          name: 'action',
          type: 'select',
          label: adminLabels.aiAction,
          required: true,
          options: [
            { label: '润色', value: 'polish' },
            { label: '扩写', value: 'expand' },
            { label: '精简', value: 'shorten' },
            { label: '自定义', value: 'custom' },
            { label: 'SEO 标题', value: 'seo_title' },
            { label: 'SEO 描述', value: 'seo_description' },
            { label: '改写', value: 'rewrite' },
            { label: '分类/标签建议', value: 'suggest_taxonomy' },
          ],
        },
        {
          name: 'outputFormat',
          type: 'select',
          label: adminLabels.aiOutputFormat,
          defaultValue: 'text',
          options: [
            { label: '文本', value: 'text' },
            { label: 'JSON', value: 'json' },
          ],
        },
        {
          name: 'enabled',
          type: 'checkbox',
          label: adminLabels.enabled,
          defaultValue: true,
        },
        {
          name: 'systemPrompt',
          type: 'textarea',
          label: adminLabels.aiSystemPrompt,
          required: true,
        },
        {
          name: 'userPrompt',
          type: 'textarea',
          label: adminLabels.aiUserPrompt,
          required: true,
          admin: {
            description:
              '变量：{{field}} {{selection}} {{title}} {{content_plain}} {{siteName}} {{existing_categories}} {{existing_tags}}',
          },
        },
      ],
    },
  ],
}
