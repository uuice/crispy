import type { CollectionConfig } from 'payload'

import {
  pagesCreateAccess,
  pagesDeleteAccess,
  pagesReadAccess,
  pagesUpdateAccess,
} from '../../access/pages'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { hero } from '@/heros/config'
import { chineseSlugField } from '@/fields/chineseSlugField'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'
import {
  createRemoveContentEmbeddingHook,
  createSyncContentEmbeddingHook,
} from '@/hooks/syncContentEmbeddingHook'
import { adminLabels } from '@/i18n/admin-labels'
import {
  aiSeoAssistField,
  aiSuggestAssistField,
  withAiTextField,
} from '@/fields/ai'
import { createSanitizeLexicalHook } from '@/hooks/createSanitizeLexicalHook'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  labels: adminLabels.pages,
  access: {
    create: pagesCreateAccess,
    delete: pagesDeleteAccess,
    read: pagesReadAccess,
    update: pagesUpdateAccess,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    withAiTextField({
      name: 'title',
      type: 'text',
      required: true,
    }),
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: adminLabels.hero,
        },
        {
          fields: [
            aiSuggestAssistField({ contentFieldPaths: 'hero.richText' }),
            {
              name: 'layout',
              type: 'blocks',
              label: adminLabels.layout,
              blocks: [CallToAction, Content, MediaBlock, Archive, FormBlock],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: adminLabels.content,
        },
        {
          name: 'meta',
          label: adminLabels.seo,
          fields: [
            aiSeoAssistField({ contentFieldPaths: 'hero.richText' }),
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
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
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
      admin: {
        position: 'sidebar',
      },
    },
    chineseSlugField(),
  ],
  hooks: {
    afterChange: [revalidatePage, createSyncContentEmbeddingHook('pages')],
    beforeChange: [populatePublishedAt],
    beforeValidate: [createSanitizeLexicalHook(['hero.richText'])],
    afterDelete: [revalidateDelete, createRemoveContentEmbeddingHook('pages')],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
