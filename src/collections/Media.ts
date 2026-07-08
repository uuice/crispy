import type { CollectionConfig } from 'payload'

import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { mediaCreateAccess, mediaDeleteAccess, mediaUpdateAccess } from '../access/media'
import { adminLabels } from '@/i18n/admin-labels'
import { withAiRewriteFeatures, withAiTextField } from '@/fields/ai'
import { createSanitizeLexicalHook } from '@/hooks/createSanitizeLexicalHook'
import { syncOssVirtualSizesAfterOperation } from '@/hooks/syncOssVirtualSizes'
import { isOssVirtualSizesEnabled } from '@/uploads/isOssVirtualSizesEnabled'
import { MEDIA_IMAGE_SIZES } from '@/uploads/mediaImageSizes'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const useOssVirtualSizes = isOssVirtualSizesEnabled()

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
    // Always register; hook checks isOssVirtualSizesEnabled() at runtime (env may be unset at module load).
    afterOperation: [syncOssVirtualSizesAfterOperation],
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
    focalPoint: !useOssVirtualSizes,
    // Virtual OSS sizes when S3 is enabled; Sharp is not used in this project
    imageSizes: MEDIA_IMAGE_SIZES,
  },
}
