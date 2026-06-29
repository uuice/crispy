import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'
import { adminLabels } from '@/i18n/admin-labels'
import { auditLogPlugin } from '@/plugins/auditLog'
import { localizePluginCollectionsPlugin } from '@/plugins/localizePluginCollections'
import { createS3StoragePlugin } from '@/storage/s3'

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
    collections: ['pages', 'posts'],
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
                description: '修改后需要重新构建站点才能在前台生效。',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
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
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
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
    collections: ['posts', 'pages'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      labels: {
        singular: '搜索索引',
        plural: '搜索索引',
      },
      admin: {
        group: adminLabels.systemGroup,
      },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  mcpPlugin({
    collections: {
      posts: { enabled: true },
      pages: { enabled: true },
      categories: { enabled: true },
      tags: { enabled: true },
      links: { enabled: true },
      'ad-slots': { enabled: true },
      ads: { enabled: true },
      jobs: { enabled: true },
      'gallery-items': { enabled: true },
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
  }),
  importExportPlugin({
    collections: [
      { slug: 'posts' },
      { slug: 'pages' },
      { slug: 'categories' },
      { slug: 'tags' },
      { slug: 'links' },
      { slug: 'jobs' },
      { slug: 'users' },
    ],
  }),
  auditLogPlugin(),
  localizePluginCollectionsPlugin(),
  ...(s3StoragePlugin ? [s3StoragePlugin] : []),
]
