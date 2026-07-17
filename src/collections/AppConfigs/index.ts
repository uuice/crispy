import type { CollectionConfig } from 'payload'

import { isEditor, isSuperAdmin } from '@/access/roles'
import { adminLabels } from '@/i18n/admin-labels'

export const AppConfigs: CollectionConfig = {
  slug: 'app-configs',
  labels: adminLabels.appConfigs,
  access: {
    create: isSuperAdmin,
    delete: isSuperAdmin,
    read: isEditor,
    update: isSuperAdmin,
  },
  admin: {
    defaultColumns: ['key', 'label', 'category', 'valueType', 'enabled', 'updatedAt'],
    useAsTitle: 'label',
    group: adminLabels.configGroup,
    description: '键值型应用配置，供运行时通过 src/config/resolve.ts 读取。',
  },
  defaultSort: 'category',
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
      type: 'textarea',
      label: adminLabels.configValue,
      admin: {
        condition: (_, siblingData) => siblingData?.valueType === 'json',
        description: '合法 JSON 字符串，如 {"foo": "bar"} 或 ["a","b"]',
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
