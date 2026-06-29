import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'


import {
  postsCreateAccess,
  postsDeleteAccess,
  postsReadAccess,
  postsUpdateAccess,
} from '../../access/posts'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { assignAuthorOnCreate } from './hooks/assignAuthorOnCreate'
import { populateAuthors } from './hooks/populateAuthors'
import { restrictAuthorPublish } from './hooks/restrictAuthorPublish'
import { sanitizePostContent } from './hooks/sanitizePostContent'
import { revalidateDelete, revalidatePost } from './hooks/revalidatePost'
import { adminLabels } from '@/i18n/admin-labels'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { chineseSlugField } from '@/fields/chineseSlugField'
import { AiRewriteFeature } from '@/components/AdminAi/lexical/AiRewriteFeature/server'

export const Posts: CollectionConfig<'posts'> = {
  slug: 'posts',
  labels: adminLabels.posts,
  access: {
    create: postsCreateAccess,
    delete: postsDeleteAccess,
    read: postsReadAccess,
    update: postsUpdateAccess,
  },
  // This config controls what's populated by default when a post is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'posts'>
  defaultPopulate: {
    title: true,
    slug: true,
    categories: true,
    tags: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'posts',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'posts',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: adminLabels.title,
      admin: {
        components: {
          Field: '@/components/AdminAi/AiTextField',
        },
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    AiRewriteFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: false,
              required: true,
            },
          ],
          label: adminLabels.content,
        },
        {
          fields: [
            {
              name: 'aiSuggestAssist',
              type: 'ui',
              admin: {
                components: {
                  Field: '@/components/AdminAi/AiSuggestPanel',
                },
              },
            },
            {
              name: 'relatedPosts',
              type: 'relationship',
              label: adminLabels.relatedPosts,
              admin: {
                position: 'sidebar',
              },
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                }
              },
              hasMany: true,
              relationTo: 'posts',
            },
            {
              name: 'categories',
              type: 'relationship',
              label: adminLabels.categoriesField,
              admin: {
                position: 'sidebar',
              },
              hasMany: true,
              relationTo: 'categories',
            },
            {
              name: 'tags',
              type: 'relationship',
              label: adminLabels.tagsField,
              admin: {
                position: 'sidebar',
              },
              hasMany: true,
              relationTo: 'tags',
            },
          ],
          label: adminLabels.meta,
        },
        {
          name: 'meta',
          label: adminLabels.seo,
          fields: [
            {
              name: 'aiSeoAssist',
              type: 'ui',
              admin: {
                components: {
                  Field: '@/components/AdminAi/AiSeoPanel',
                },
              },
            },
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
    {
      name: 'authors',
      type: 'relationship',
      label: adminLabels.authors,
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'users',
    },
    // This field is only used to populate the user data via the `populateAuthors` hook
    // This is because the `user` collection has access control locked to protect user privacy
    // GraphQL will also not return mutated user data that differs from the underlying schema
    {
      name: 'populatedAuthors',
      type: 'array',
      access: {
        update: () => false,
      },
      admin: {
        disabled: true,
        readOnly: true,
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
    chineseSlugField(),
  ],
  hooks: {
    beforeValidate: [sanitizePostContent],
    beforeChange: [assignAuthorOnCreate, restrictAuthorPublish],
    afterChange: [revalidatePost],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
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
