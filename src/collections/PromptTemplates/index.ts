import type { CollectionConfig } from 'payload'

import { requirePermission } from '@/access/can'
import { adminLabels } from '@/i18n/admin-labels'
import { defaultCollectionVersions } from '@/collections/defaults'
import { chineseSlugField } from '@/fields/chineseSlugField'

export const PromptTemplates: CollectionConfig = {
  slug: 'prompt-templates',
  labels: adminLabels.promptTemplates,
  access: {
    create: requirePermission('catalog:prompts:write'),
    delete: requirePermission('catalog:prompts:write'),
    read: requirePermission('catalog:prompts:read'),
    update: requirePermission('catalog:prompts:write'),
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'action', 'provider', 'model', 'enabled', 'updatedAt'],
    group: adminLabels.configGroup,
    description:
      '字段 AI / 画布技能卡。可绑定 LLM Provider 与模型；留空则使用 AI 设置中的全局默认。也可在后台 AI 助手中由超级管理员维护。',
  },
  versions: defaultCollectionVersions,
  trash: true,
  defaultSort: 'sort',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: adminLabels.title,
      required: true,
    },
    chineseSlugField({ fieldToUse: 'title' }),
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
      admin: {
        position: 'sidebar',
      },
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
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'enabled',
      type: 'checkbox',
      label: adminLabels.enabled,
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sort',
      type: 'number',
      label: adminLabels.sort,
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'provider',
      type: 'relationship',
      relationTo: 'llm-providers',
      label: adminLabels.llmProvider,
      admin: {
        description: '可空 = 使用 AI 设置中的默认 Provider',
        position: 'sidebar',
      },
    },
    {
      name: 'model',
      type: 'text',
      label: adminLabels.aiModel,
      admin: {
        description: '可空 = 使用 Provider 的 defaultModel 或全局 defaultModel',
        position: 'sidebar',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'temperature',
          type: 'number',
          label: adminLabels.aiTemperature,
          min: 0,
          max: 2,
          admin: {
            width: '50%',
            step: 0.1,
            description: '可空 = 全局默认',
          },
        },
        {
          name: 'maxTokens',
          type: 'number',
          label: adminLabels.aiMaxTokens,
          min: 256,
          max: 8192,
          admin: {
            width: '50%',
            step: 256,
            description: '可空 = 全局默认',
          },
        },
      ],
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
          '变量：{{field}} {{selection}} {{title}} {{content_plain}} {{siteName}} {{existing_categories}} {{existing_tags}} {{instruction}}',
      },
    },
  ],
}
