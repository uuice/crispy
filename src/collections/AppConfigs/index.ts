import type { CollectionConfig } from 'payload'

import { requirePermission } from '@/access/can'
import { adminLabels } from '@/i18n/admin-labels'

function prettyPrintJson(raw: unknown): string | unknown {
  if (typeof raw !== 'string') return raw
  const trimmed = raw.trim()
  if (!trimmed) return raw

  try {
    return JSON.stringify(JSON.parse(trimmed), null, 2)
  } catch {
    return raw
  }
}

export const AppConfigs: CollectionConfig = {
  slug: 'app-configs',
  labels: adminLabels.appConfigs,
  access: {
    create: requirePermission('catalog:app-configs:write'),
    delete: requirePermission('catalog:app-configs:write'),
    read: requirePermission('catalog:app-configs:read'),
    update: requirePermission('catalog:app-configs:write'),
  },
  admin: {
    defaultColumns: ['key', 'label', 'category', 'valueType', 'enabled', 'updatedAt'],
    useAsTitle: 'label',
    group: adminLabels.configGroup,
    description: '键值型应用配置，供运行时通过 src/config/resolve.ts 读取。',
  },
  defaultSort: 'category',
  hooks: {
    afterRead: [
      ({ doc }) => {
        if (doc?.valueType === 'json') {
          doc.valueJson = prettyPrintJson(doc.valueJson) as string
        }
        return doc
      },
    ],
    beforeChange: [
      ({ data }) => {
        if (data?.valueType === 'json') {
          data.valueJson = prettyPrintJson(data.valueJson) as string
        }
        return data
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'key',
          type: 'text',
          label: adminLabels.configKey,
          required: true,
          unique: true,
          admin: {
            width: '50%',
            description: '唯一标识，如 comments.pageSize',
          },
        },
        {
          name: 'label',
          type: 'text',
          label: adminLabels.title,
          required: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'category',
      type: 'select',
      label: adminLabels.configCategory,
      required: true,
      defaultValue: 'general',
      options: [
        { label: adminLabels.configCategoryGeneral, value: 'general' },
        { label: adminLabels.configCategoryComments, value: 'comments' },
        { label: adminLabels.configCategoryFeatures, value: 'features' },
        { label: adminLabels.configCategoryIntegrations, value: 'integrations' },
        { label: adminLabels.configCategoryOther, value: 'other' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: adminLabels.description,
    },
    {
      name: 'valueType',
      type: 'select',
      label: adminLabels.configValueType,
      required: true,
      defaultValue: 'string',
      options: [
        { label: adminLabels.configValueTypeString, value: 'string' },
        { label: adminLabels.configValueTypeNumber, value: 'number' },
        { label: adminLabels.configValueTypeBoolean, value: 'boolean' },
        { label: adminLabels.configValueTypeJson, value: 'json' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'valueString',
      type: 'text',
      label: adminLabels.configValue,
      admin: {
        condition: (_, siblingData) => siblingData?.valueType === 'string',
      },
    },
    {
      name: 'valueNumber',
      type: 'number',
      label: adminLabels.configValue,
      admin: {
        condition: (_, siblingData) => siblingData?.valueType === 'number',
      },
    },
    {
      name: 'valueBoolean',
      type: 'checkbox',
      label: adminLabels.configValue,
      defaultValue: false,
      admin: {
        condition: (_, siblingData) => siblingData?.valueType === 'boolean',
      },
    },
    {
      name: 'valueJson',
      type: 'code',
      label: adminLabels.configValue,
      admin: {
        language: 'json',
        condition: (_, siblingData) => siblingData?.valueType === 'json',
        description: '合法 JSON（打开/保存时自动格式化）',
        editorOptions: {
          lineNumbers: 'on',
          minimap: { enabled: false },
        },
      },
      validate: (value) => {
        if (value == null || value === '') return true
        if (typeof value !== 'string') return 'JSON 必须是字符串'
        try {
          JSON.parse(value)
          return true
        } catch {
          return '不是合法 JSON'
        }
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
  ],
}
