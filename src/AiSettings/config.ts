import type { GlobalConfig } from 'payload'

import { isEditor, isSuperAdmin } from '@/access/roles'
import { DEFAULT_AI_TEMPLATES } from '@/ai/defaultTemplates'
import { adminLabels } from '@/i18n/admin-labels'

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
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: adminLabels.aiEnabled,
      defaultValue: true,
      admin: {
        description: '关闭后 Admin 内 AI 按钮不可用。API Key 请在 .env 配置 DEEPSEEK_API_KEY。',
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
            description: '如 deepseek-chat、deepseek-reasoner',
          },
        },
        {
          name: 'baseUrl',
          type: 'text',
          label: adminLabels.aiBaseUrl,
          defaultValue: 'https://api.deepseek.com',
          admin: { width: '50%' },
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
