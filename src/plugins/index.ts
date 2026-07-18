import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { withAiRewriteFeatures } from '@/fields/ai'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'
import { adminLabels } from '@/i18n/admin-labels'
import { auditLogPlugin } from '@/plugins/auditLog'
import { enableListRefreshButtonPlugin } from '@/plugins/enableListRefreshButton'
import { enableQueryPresetsPlugin } from '@/plugins/enableQueryPresets'
import { enableTrashAndVersionsPlugin } from '@/plugins/enableTrashAndVersions'
import { localizeFieldLabelsPlugin } from '@/plugins/localizeFieldLabels'
import { localizePluginCollectionsPlugin } from '@/plugins/localizePluginCollections'
import { AGENT_GLOBALS } from '@/ai/agent/resources'
import { mcpCustomTools } from '@/plugins/mcpCustomTools'
import { createS3StoragePlugin } from '@/storage/s3'
import { resolveEmailConfigSync } from '@/email/resolveEmailConfig'

import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Crispy` : 'Crispy CMS'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

const s3StoragePlugin = createS3StoragePlugin()

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts', 'novel-chapters'],
    overrides: {
      labels: {
        singular: '重定向',
        plural: '重定向',
      },
      admin: {
        group: adminLabels.operationsGroup,
      },
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: '修改后约 60 秒内自动生效（middleware 缓存）。',
              },
            }
          }
          return field
        })
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    defaultToEmail: resolveEmailConfigSync().formDefaultToEmail,
    fields: {
      payment: false,
    },
    formOverrides: {
      labels: {
        singular: '表单',
        plural: '表单',
      },
      admin: {
        group: adminLabels.operationsGroup,
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) =>
                  withAiRewriteFeatures([
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]),
              }),
            }
          }
          return field
        })
      },
    },
    formSubmissionOverrides: {
      labels: {
        singular: '表单提交',
        plural: '表单提交',
      },
      admin: {
        group: adminLabels.operationsGroup,
      },
    },
  }),
  searchPlugin({
    collections: ['posts', 'pages', 'jobs', 'galleries'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      labels: {
        singular: '搜索索引',
        plural: '搜索索引',
      },
      admin: {
        group: adminLabels.devGroup,
      },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  mcpPlugin({
    overrideAuth: async (req, getDefaultMcpAccessSettings) => {
      const settings = await getDefaultMcpAccessSettings()
      const user = settings.user
      if (user && typeof user === 'object') {
        req.user = user
      }
      return settings
    },
    collections: {
      posts: { enabled: true },
      pages: { enabled: true },
      categories: { enabled: true },
      tags: { enabled: true },
      links: { enabled: true },
      'link-groups': { enabled: true },
      'ad-slots': { enabled: true },
      ads: { enabled: true },
      jobs: { enabled: true },
      galleries: { enabled: true },
      'gallery-items': { enabled: true },
      novels: { enabled: true },
      'novel-chapters': { enabled: true },
      'novel-categories': { enabled: true },
      'novel-tags': { enabled: true },
      'short-links': { enabled: true },
      redirects: { enabled: true },
      forms: { enabled: true },
      'form-submissions': {
        enabled: {
          create: false,
          delete: true,
          find: true,
          update: false,
        },
      },
      'payload-query-presets': { enabled: true },
      'app-configs': {
        enabled: {
          create: false,
          delete: false,
          find: true,
          update: false,
        },
      },
      'llm-providers': {
        enabled: {
          create: false,
          delete: false,
          find: true,
          update: false,
        },
      },
      'prompt-templates': {
        enabled: {
          create: false,
          delete: false,
          find: true,
          update: false,
        },
      },
      'storage-targets': {
        enabled: {
          create: false,
          delete: false,
          find: true,
          update: false,
        },
      },
      'integration-credentials': {
        enabled: {
          create: false,
          delete: false,
          find: true,
          update: false,
        },
      },
      'email-transports': {
        enabled: {
          create: false,
          delete: false,
          find: true,
          update: false,
        },
      },
      comments: {
        enabled: {
          create: true,
          delete: false,
          find: true,
          update: true,
        },
      },
      media: {
        enabled: {
          create: true,
          delete: false,
          find: true,
          update: true,
        },
      },
      users: {
        enabled: {
          create: false,
          delete: false,
          find: true,
          update: false,
        },
      },
    },
    globals: Object.fromEntries(
      AGENT_GLOBALS.map((global) => [
        global.slug,
        {
          enabled: { find: true, update: true },
          description: global.description,
        },
      ]),
    ),
    mcp: {
      tools: mcpCustomTools,
    },
  }),
  importExportPlugin({
    collections: [
      { slug: 'posts' },
      { slug: 'pages' },
      { slug: 'categories' },
      { slug: 'tags' },
      { slug: 'links' },
      { slug: 'link-groups' },
      { slug: 'jobs' },
      { slug: 'users' },
      { slug: 'galleries' },
      { slug: 'gallery-items' },
      { slug: 'short-links' },
      { slug: 'redirects' },
      { slug: 'forms' },
      { slug: 'comments' },
      { slug: 'ad-slots' },
      { slug: 'ads' },
      { slug: 'novels' },
      { slug: 'novel-chapters' },
      { slug: 'novel-categories' },
      { slug: 'novel-tags' },
    ],
  }),
  auditLogPlugin(),
  localizePluginCollectionsPlugin(),
  enableQueryPresetsPlugin(),
  enableListRefreshButtonPlugin(),
  enableTrashAndVersionsPlugin(),
  localizeFieldLabelsPlugin(),
  ...(s3StoragePlugin ? [s3StoragePlugin] : []),
]
