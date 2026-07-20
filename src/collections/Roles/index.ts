import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionBeforeChangeHook,
  CollectionBeforeDeleteHook,
  CollectionConfig,
} from 'payload'

import {
  deleteRoleAuthzCache,
  invalidateUsersForRole,
  isSystemRoleSlug,
  setRoleAuthzCache,
} from '@/access/authzCache'
import { canAny, requirePermission } from '@/access/can'
import { ROLES_SLUG } from '@/access/collectionSlugs'
import { PERMISSION_SELECT_OPTIONS, uniquePermissions } from '@/access/permissions'
import { adminLabels } from '@/i18n/admin-labels'

export { ROLES_SLUG }

const protectSystemRole: CollectionBeforeChangeHook = async ({ data, originalDoc, operation }) => {
  if (operation === 'update' && originalDoc?.isSystem) {
    data.slug = originalDoc.slug
    data.isSystem = true
  }

  if (typeof data.slug === 'string') {
    data.slug = data.slug.trim().toLowerCase()
  }

  if (Array.isArray(data.permissions)) {
    data.permissions = uniquePermissions(data.permissions.map(String))
  }

  if (operation === 'create' && isSystemRoleSlug(String(data.slug ?? ''))) {
    data.isSystem = true
  }

  return data
}

const preventDeleteSystemRole: CollectionBeforeDeleteHook = async ({ id, req }) => {
  const doc = await req.payload.findByID({
    collection: ROLES_SLUG,
    id,
    depth: 0,
    overrideAccess: true,
  })
  if (doc?.isSystem) {
    throw new Error('系统角色不可删除')
  }
}

const syncRoleAuthzCache: CollectionAfterChangeHook = async ({ doc, req, context }) => {
  if (context?.skipAuthzCacheHooks) return doc

  const permissions = uniquePermissions((doc.permissions ?? []).map(String))
  await setRoleAuthzCache(req.payload, doc.id, {
    slug: String(doc.slug),
    permissions,
  })
  await invalidateUsersForRole(req.payload, doc.id)
  return doc
}

const clearRoleAuthzCache: CollectionAfterDeleteHook = async ({ doc, req, context }) => {
  if (context?.skipAuthzCacheHooks) return doc
  await deleteRoleAuthzCache(req.payload, doc.id)
  await invalidateUsersForRole(req.payload, doc.id)
  return doc
}

export const Roles: CollectionConfig = {
  slug: ROLES_SLUG,
  labels: adminLabels.rolesCollection,
  access: {
    create: requirePermission('roles:manage'),
    delete: requirePermission('roles:manage'),
    // users:manage needs read so Users.roles relationship can populate options
    read: async ({ req }) => canAny(req.user, ['roles:manage', 'users:manage'], req),
    update: requirePermission('roles:manage'),
    admin: async ({ req }) => canAny(req.user, ['roles:manage', 'users:manage'], req),
  },
  admin: {
    defaultColumns: ['name', 'slug', 'isSystem', 'updatedAt'],
    useAsTitle: 'name',
    group: adminLabels.systemGroup,
    description: '后台可新增角色并勾选权限；保存后写入 authz-cache，立即生效。',
  },
  trash: false,
  versions: false,
  hooks: {
    beforeChange: [protectSystemRole],
    beforeDelete: [preventDeleteSystemRole],
    afterChange: [syncRoleAuthzCache],
    afterDelete: [clearRoleAuthzCache],
  },
  timestamps: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: adminLabels.name,
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: adminLabels.slug,
      required: true,
      unique: true,
      index: true,
      admin: {
        description: '稳定标识（如 editor）。系统角色创建后不可改 slug。',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: adminLabels.description,
    },
    {
      name: 'isSystem',
      type: 'checkbox',
      label: adminLabels.roleIsSystem,
      defaultValue: false,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: '系统角色由程序维护，不可删除。',
      },
    },
    {
      name: 'permissions',
      type: 'select',
      label: adminLabels.rolePermissions,
      hasMany: true,
      options: PERMISSION_SELECT_OPTIONS,
      admin: {
        description: '权限枚举由代码注册；此处仅勾选。',
      },
    },
  ],
}
