import type { Access, Payload, PayloadRequest } from 'payload'

import { getUserAuthz } from '@/access/authzCache'
import { extractRoleSlugs } from '@/access/roles'
import {
  type Permission,
  type SystemRoleSlug,
  SYSTEM_ROLE_DEFINITIONS,
} from '@/access/permissions'

type AuthUser = PayloadRequest['user']

/** Shape attached on /me (permissions) or JWT (roles fallback). */
export type AuthzUserShape = {
  permissions?: string[] | null
  roles?: unknown
} | null | undefined

function resolvePayload(reqOrPayload: PayloadRequest | Payload): Payload {
  if ('payload' in reqOrPayload && reqOrPayload.payload) {
    return reqOrPayload.payload
  }
  return reqOrPayload as Payload
}

export async function can(
  user: AuthUser,
  permission: Permission,
  reqOrPayload: PayloadRequest | Payload,
): Promise<boolean> {
  if (!user?.id) return false
  const payload = resolvePayload(reqOrPayload)
  const req = 'payload' in reqOrPayload ? (reqOrPayload as PayloadRequest) : undefined
  const authz = await getUserAuthz(payload, user.id, req)
  return authz.permissions.includes(permission)
}

export async function canAny(
  user: AuthUser,
  permissions: Permission[],
  reqOrPayload: PayloadRequest | Payload,
): Promise<boolean> {
  if (!user?.id || permissions.length === 0) return false
  const payload = resolvePayload(reqOrPayload)
  const req = 'payload' in reqOrPayload ? (reqOrPayload as PayloadRequest) : undefined
  const authz = await getUserAuthz(payload, user.id, req)
  return permissions.some((permission) => authz.permissions.includes(permission))
}

function permissionsFromRoleSlugs(user: AuthzUserShape): Permission[] {
  const merged = new Set<Permission>()
  for (const slug of extractRoleSlugs(user)) {
    const definition = SYSTEM_ROLE_DEFINITIONS[slug as SystemRoleSlug]
    if (!definition) continue
    for (const permission of definition.permissions) merged.add(permission)
  }
  return [...merged]
}

/**
 * Sync check for Admin UI (e.g. admin.hidden). Prefer /me permissions when
 * attached (including an empty list after roles were stripped). Fall back to
 * system role matrices only when permissions are not yet on the user object.
 */
export function userHasPermissionSync(user: AuthzUserShape, permission: Permission): boolean {
  const permissions = user?.permissions
  if (Array.isArray(permissions)) {
    return permissions.includes(permission)
  }
  return permissionsFromRoleSlugs(user).includes(permission)
}

export function userHasAnyPermissionSync(
  user: AuthzUserShape,
  permissions: Permission[],
): boolean {
  if (permissions.length === 0) return false
  return permissions.some((permission) => userHasPermissionSync(user, permission))
}

/** Access helper: user must have the given permission. */
export function requirePermission(permission: Permission): Access {
  return async ({ req }) => can(req.user, permission, req)
}

/** Access helper: user must have any of the given permissions. */
export function requireAnyPermission(permissions: Permission[]): Access {
  return async ({ req }) => canAny(req.user, permissions, req)
}
