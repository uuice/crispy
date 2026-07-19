import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { CRISPY_ROLES, hasRole } from '../../access/roles'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { withAiRewriteFeatures } from '@/fields/ai'
import { createSanitizeLexicalHook } from '@/hooks/createSanitizeLexicalHook'
import { adminLabels } from '@/i18n/admin-labels'

const authorBioDetailEditor = lexicalEditor({
  features: ({ rootFeatures }) =>
    withAiRewriteFeatures([
      ...rootFeatures,
      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
      BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
      FixedToolbarFeature(),
    ]),
})

export const Users: CollectionConfig = {
  slug: 'users',
  labels: adminLabels.users,
  access: {
    admin: authenticated,
    create: ({ req: { user } }) => hasRole(user, ['super-admin']),
    delete: ({ req: { user } }) => hasRole(user, ['super-admin']),
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
    group: adminLabels.systemGroup,
  },
  auth: {
    // Populate upload relations (e.g. avatar) on /me for the Admin header.
    depth: 1,
    useAPIKey: true,
  },
  hooks: {
    beforeValidate: [createSanitizeLexicalHook(['bioDetail'])],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: adminLabels.name,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: adminLabels.userAvatar,
      admin: {
        description: '后台头像；未上传时显示默认图标（不依赖 Gravatar）。',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      label: adminLabels.userBio,
      admin: {
        description: '短简介，用于侧栏与作者页 Banner；留空则不展示。',
      },
    },
    {
      name: 'bioDetail',
      type: 'richText',
      label: adminLabels.userBioDetail,
      admin: {
        description: '作者详情页正文，编辑器与文章一致；留空则不展示。',
      },
      editor: authorBioDetailEditor,
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      defaultValue: ['author'],
      required: true,
      label: adminLabels.roles,
      options: CRISPY_ROLES,
      access: {
        update: ({ req: { user } }) => hasRole(user, ['super-admin']),
      },
    },
  ],
  timestamps: true,
}
