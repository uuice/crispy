import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { hideUnlessAnyPermission } from '@/access/adminHidden'
import { can } from '@/access/can'
import { ROLES_SLUG } from '@/access/collectionSlugs'
import { ensureSystemRoles, findRoleIdBySlug } from '@/access/ensureSystemRoles'
import { deleteUserAuthzCache, getUserAuthz, recomputeAndCacheUserAuthz } from '@/access/authzCache'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { createSanitizeLexicalHook } from '@/hooks/createSanitizeLexicalHook'
import { adminLabels } from '@/i18n/admin-labels'

const authorBioDetailEditor = lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,
    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
    BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
    FixedToolbarFeature(),
  ],
})

export const Users: CollectionConfig = {
  slug: 'users',
  labels: adminLabels.users,
  access: {
    admin: authenticated,
    create: ({ req }) => can(req.user, 'users:manage', req),
    delete: ({ req }) => can(req.user, 'users:manage', req),
    read: authenticated,
    update: async ({ req }) => {
      if (!req.user) return false
      if (await can(req.user, 'users:manage', req)) return true
      return { id: { equals: req.user.id } }
    },
  },
  admin: {
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
    group: adminLabels.systemGroup,
    hidden: hideUnlessAnyPermission('users:manage'),
  },
  auth: {
    // Populate upload relations (e.g. avatar) on /me for the Admin header.
    depth: 1,
    useAPIKey: true,
  },
  hooks: {
    beforeValidate: [
      createSanitizeLexicalHook(['bioDetail']),
      async ({ data, operation, req }) => {
        if (!data) return data
        if (
          operation === 'create' &&
          (!data.roles || (Array.isArray(data.roles) && data.roles.length === 0))
        ) {
          await ensureSystemRoles(req.payload)
          const authorId = await findRoleIdBySlug(req.payload, 'author')
          if (authorId != null) data.roles = [authorId]
        }
        return data
      },
    ],
    afterRead: [
      async ({ doc, req }) => {
        // Attach authz-cache permissions for /me (Edge middleware + Admin client).
        if (!doc?.id || !req?.user || String(req.user.id) !== String(doc.id)) {
          return doc
        }
        try {
          const authz = await getUserAuthz(req.payload, doc.id, req)
          return {
            ...doc,
            permissions: authz.permissions,
            roleSlugs: authz.roleSlugs,
          }
        } catch {
          return doc
        }
      },
    ],
    afterChange: [
      async ({ doc, req, context }) => {
        if (context?.skipAuthzCacheHooks) return doc
        await recomputeAndCacheUserAuthz(req.payload, doc.id, doc.roles)
        return doc
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        await deleteUserAuthzCache(req.payload, doc.id)
        return doc
      },
    ],
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
      type: 'relationship',
      relationTo: ROLES_SLUG,
      hasMany: true,
      required: true,
      label: adminLabels.roles,
      admin: {
        description: '可多选；权限来自角色并在 authz-cache 中合并，改角色后立即生效。',
      },
      access: {
        update: ({ req }) => can(req.user, 'users:manage', req),
      },
    },
  ],
  timestamps: true,
}
