import type { Access, Payload, PayloadRequest } from 'payload'

import { getUserAuthz } from '@/access/authzCache'
import type { Permission } from '@/access/permissions'

type AuthUser = PayloadRequest['user']

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

/** Access helper: user must have the given permission. */
export function requirePermission(permission: Permission): Access {
  return async ({ req }) => can(req.user, permission, req)
}

/** Access helper: user must have any of the given permissions. */
export function requireAnyPermission(permissions: Permission[]): Access {
  return async ({ req }) => canAny(req.user, permissions, req)
}
