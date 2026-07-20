import type { Payload } from 'payload'

import { setRoleAuthzCache } from '@/access/authzCache'
import { ROLES_SLUG } from '@/access/collectionSlugs'
import {
  SYSTEM_ROLE_DEFINITIONS,
  SYSTEM_ROLE_SLUGS,
  type SystemRoleSlug,
  uniquePermissions,
} from '@/access/permissions'

export async function findRoleIdBySlug(
  payload: Payload,
  slug: SystemRoleSlug | string,
): Promise<number | null> {
  const result = await payload.find({
    collection: ROLES_SLUG,
    limit: 1,
    pagination: false,
    overrideAccess: true,
    depth: 0,
    where: { slug: { equals: slug } },
  })
  const id = result.docs[0]?.id
  return id == null ? null : Number(id)
}

/**
 * Ensure the three system roles exist. Does not overwrite permissions on existing roles
 * so Admin edits to the matrix survive restarts.
 */
export async function ensureSystemRoles(payload: Payload): Promise<Record<SystemRoleSlug, number>> {
  const ids = {} as Record<SystemRoleSlug, number>

  for (const slug of SYSTEM_ROLE_SLUGS) {
    const definition = SYSTEM_ROLE_DEFINITIONS[slug]
    const existing = await payload.find({
      collection: ROLES_SLUG,
      limit: 1,
      pagination: false,
      overrideAccess: true,
      depth: 0,
      where: { slug: { equals: slug } },
    })

    let roleId: number
    let permissions = definition.permissions

    if (existing.docs[0]) {
      roleId = Number(existing.docs[0].id)
      permissions = uniquePermissions((existing.docs[0].permissions ?? []).map(String))
      if (permissions.length === 0) {
        const updated = await payload.update({
          collection: ROLES_SLUG,
          id: roleId,
          overrideAccess: true,
          depth: 0,
          context: { skipAuthzCacheHooks: true },
          data: { permissions: definition.permissions, isSystem: true },
        })
        roleId = Number(updated.id)
        permissions = definition.permissions
      }
    } else {
      const created = await payload.create({
        collection: ROLES_SLUG,
        overrideAccess: true,
        depth: 0,
        context: { skipAuthzCacheHooks: true },
        data: {
          name: definition.name,
          slug,
          description: definition.description,
          permissions: definition.permissions,
          isSystem: true,
        },
      })
      roleId = Number(created.id)
      permissions = definition.permissions
    }

    await setRoleAuthzCache(payload, roleId, {
      slug,
      permissions,
    })
    ids[slug] = roleId
  }

  return ids
}
