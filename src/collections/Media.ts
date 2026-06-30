import type { CollectionConfig } from 'payload'

import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { mediaCreateAccess, mediaDeleteAccess, mediaUpdateAccess } from '../access/media'
import { adminLabels } from '@/i18n/admin-labels'
import { withAiRewriteFeatures, withAiTextField } from '@/fields/ai'
import { createSanitizeLexicalHook } from '@/hooks/createSanitizeLexicalHook'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  labels: adminLabels.media,
  folders: true,
  access: {
    create: mediaCreateAccess,
    delete: mediaDeleteAccess,
    read: anyone,
    update: mediaUpdateAccess,
  },
  hooks: {
    beforeValidate: [createSanitizeLexicalHook(['caption'])],
  },
  fields: [
    withAiTextField(
      {
        name: 'alt',
        type: 'text',
        label: adminLabels.alt,
      },
      { contentFieldPaths: 'caption', titleFieldPath: 'alt' },
    ),
    {
      name: 'caption',
      type: 'richText',
      label: adminLabels.caption,
      editor: lexicalEditor({
        features: ({ rootFeatures }) =>
          withAiRewriteFeatures([...rootFeatures, FixedToolbarFeature()]),
      }),
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
}
