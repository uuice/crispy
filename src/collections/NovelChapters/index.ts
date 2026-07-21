import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import {
  novelChaptersReadAccess,
  novelChaptersWriteAccess,
} from '@/access/novelChapters'
import { hideUnlessAnyPermission } from '@/access/adminHidden'
import { Banner } from '@/blocks/Banner/config'
import { Code } from '@/blocks/Code/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { aiSeoAssistField, aiSuggestAssistField, withAiRewriteFeatures, withAiTextField } from '@/fields/ai'
import { chineseSlugField } from '@/fields/chineseSlugField'
import {
  createRemoveContentEmbeddingHook,
  createSyncContentEmbeddingHook,
} from '@/hooks/syncContentEmbeddingHook'
import { createSanitizeLexicalHook } from '@/hooks/createSanitizeLexicalHook'
import { adminLabels } from '@/i18n/admin-labels'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const NovelChapters: CollectionConfig<'novel-chapters'> = {
  slug: 'novel-chapters',
  labels: adminLabels.novelChapters,
  access: {
    create: novelChaptersWriteAccess,
    delete: novelChaptersWriteAccess,
    read: novelChaptersReadAccess,
    update: novelChaptersWriteAccess,
  },
  admin: {
    group: adminLabels.novelGroup,
    defaultColumns: ['title', 'novel', 'slug', 'updatedAt'],
    useAsTitle: 'title',
    hidden: hideUnlessAnyPermission('novels:manage', 'novels:read:all'),
    description: '长篇小说章节正文，与博客文章（posts）独立管理。',
  },
  defaultPopulate: {
    title: true,
    slug: true,
    novel: true,
    categories: true,
    tags: true,
    meta: {
      image: true,
      description: true,
    },
  },
  fields: [
    withAiTextField({
      name: 'title',
      type: 'text',
      required: true,
      label: adminLabels.title,
    }),
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) =>
                  withAiRewriteFeatures([
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                    FixedToolbarFeature(),
                  ]),
              }),
              label: false,
              required: true,
            },
          ],
          label: adminLabels.content,
        },
        {
          fields: [
            aiSuggestAssistField({ contentFieldPaths: 'content' }),
            {
              name: 'novel',
              type: 'relationship',
              label: adminLabels.chapterNovel,
              relationTo: 'novels',
              required: true,
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'categories',
              type: 'relationship',
              label: adminLabels.novelCategoriesField,
              relationTo: 'novel-categories',
              hasMany: true,
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'tags',
              type: 'relationship',
              label: adminLabels.novelTagsField,
              relationTo: 'novel-tags',
              hasMany: true,
              admin: {
                position: 'sidebar',
              },
            },
          ],
          label: adminLabels.meta,
        },
        {
          name: 'meta',
          label: adminLabels.seo,
          fields: [
            aiSeoAssistField({ contentFieldPaths: 'content' }),
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: adminLabels.publishedAt,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    chineseSlugField(),
  ],
  hooks: {
    beforeValidate: [createSanitizeLexicalHook(['content'])],
    afterChange: [createSyncContentEmbeddingHook('novel-chapters')],
    afterDelete: [createRemoveContentEmbeddingHook('novel-chapters')],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 800,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
