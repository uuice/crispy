import type { CollectionConfig, Plugin } from 'payload'

import { requireAnyPermission, requirePermission } from '@/access/can'
import { adminLabels } from '@/i18n/admin-labels'

const COLLECTION_LOCALIZATIONS: Record<string, Partial<CollectionConfig>> = {
  redirects: {
    labels: { singular: '重定向', plural: '重定向' },
    admin: { group: adminLabels.operationsGroup },
  },
  search: {
    labels: { singular: '搜索索引', plural: '搜索索引' },
    admin: { group: adminLabels.devGroup },
  },
  forms: {
    labels: { singular: '表单', plural: '表单' },
    admin: { group: adminLabels.operationsGroup },
  },
  'form-submissions': {
    labels: { singular: '表单提交', plural: '表单提交' },
    admin: { group: adminLabels.operationsGroup },
  },
  exports: {
    labels: { singular: '导出任务', plural: '导出任务' },
    admin: { group: adminLabels.importExportGroup },
    // Plugin only locks update; create/delete default to any logged-in user.
    access: {
      create: requireAnyPermission(['ops:manage', 'posts:update:any', 'pages:manage']),
      read: requireAnyPermission(['ops:manage', 'posts:update:any', 'pages:manage']),
      update: () => false,
      delete: requireAnyPermission(['ops:manage', 'posts:update:any', 'pages:manage']),
    },
  },
  imports: {
    labels: { singular: '导入任务', plural: '导入任务' },
    admin: { group: adminLabels.importExportGroup },
    access: {
      create: requireAnyPermission(['ops:manage', 'posts:update:any', 'pages:manage']),
      read: requireAnyPermission(['ops:manage', 'posts:update:any', 'pages:manage']),
      update: () => false,
      delete: requireAnyPermission(['ops:manage', 'posts:update:any', 'pages:manage']),
    },
  },
  'payload-mcp-api-keys': {
    labels: { singular: 'MCP API 密钥', plural: 'MCP API 密钥' },
    admin: {
      group: adminLabels.devGroup,
      description: 'API 密钥控制 MCP 客户端可访问的集合、资源、工具与提示。',
    },
    access: {
      create: requirePermission('catalog:secrets'),
      read: requirePermission('catalog:secrets'),
      update: requirePermission('catalog:secrets'),
      delete: requirePermission('catalog:secrets'),
    },
  },
  'payload-folders': {
    labels: { singular: '文件夹', plural: '文件夹' },
  },
}

export function localizePluginCollectionsPlugin(): Plugin {
  return (config) => ({
    ...config,
    collections: (config.collections ?? []).map((collection) => {
      const localization = COLLECTION_LOCALIZATIONS[collection.slug]
      if (!localization) return collection

      return {
        ...collection,
        labels: localization.labels ?? collection.labels,
        admin: {
          ...collection.admin,
          ...localization.admin,
        },
        ...(localization.access
          ? {
              access: {
                ...collection.access,
                ...localization.access,
              },
            }
          : {}),
      }
    }),
  })
}
