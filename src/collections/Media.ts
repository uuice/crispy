import type { CollectionConfig } from 'payload'

import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { hideUnlessAnyPermission } from '@/access/adminHidden'
import { mediaCreateAccess, mediaDeleteAccess, mediaUpdateAccess } from '../access/media'
import { adminLabels } from '@/i18n/admin-labels'
import { withAiRewriteFeatures, withAiTextField } from '@/fields/ai'
import { createSanitizeLexicalHook } from '@/hooks/createSanitizeLexicalHook'
import { setMediaOssDatePrefix } from '@/hooks/setMediaOssDatePrefix'
import { presentMediaOssUrlsAfterRead } from '@/hooks/presentMediaOssUrlsAfterRead'
import { syncOssVirtualSizesAfterOperation } from '@/hooks/syncOssVirtualSizes'
import { isOssVirtualSizesEnabled } from '@/uploads/isOssVirtualSizesEnabled'
import { MEDIA_IMAGE_SIZES } from '@/uploads/mediaImageSizes'
import { resolveAdminMediaThumbnailUrl } from '@/uploads/resolveAdminMediaThumbnailUrl'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const useOssVirtualSizes = isOssVirtualSizesEnabled()

export const Media: CollectionConfig = {
  slug: 'media',
  labels: adminLabels.media,
  folders: true,
  admin: {
    group: adminLabels.contentGroup,
    hidden: hideUnlessAnyPermission('media:create', 'media:update', 'media:delete'),
  },
  access: {
    create: mediaCreateAccess,
    delete: mediaDeleteAccess,
    read: anyone,
    update: mediaUpdateAccess,
  },
  hooks: {
    beforeChange: [setMediaOssDatePrefix],
    beforeValidate: [createSanitizeLexicalHook(['caption'])],
    afterRead: [presentMediaOssUrlsAfterRead],
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
    // Function form returns direct OSS URLs; string form only loads sizes.*.filename in list views.
    adminThumbnail: ({ doc }) => resolveAdminMediaThumbnailUrl(doc),
    focalPoint: !useOssVirtualSizes,
    // Virtual OSS sizes when S3 is enabled; Sharp is not used in this project
    imageSizes: MEDIA_IMAGE_SIZES,
  },
}
