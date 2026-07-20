import type { Payload, PayloadRequest } from 'payload'

import { AUTHZ_CACHE_SLUG, ROLES_SLUG } from '@/access/collectionSlugs'
import {
  type Permission,
  type SystemRoleSlug,
  uniquePermissions,
} from '@/access/permissions'

export type AuthzUserCacheValue = {
  roleIds: string[]
  roleSlugs: string[]
  permissions: Permission[]
}

export type AuthzRoleCacheValue = {
  slug: string
  permissions: Permission[]
}

const REQ_MEMO = Symbol.for('crispy.authzUserMemo')

type ReqWithAuthzMemo = PayloadRequest & {
  [REQ_MEMO]?: Map<string, AuthzUserCacheValue>
}

function userCacheKey(userId: string | number): string {
  return `user:${userId}`
}

function roleCacheKey(roleId: string | number): string {
  return `role:${roleId}`
}

function asId(value: unknown): string | null {
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id: unknown }).id
    if (typeof id === 'string' || typeof id === 'number') return String(id)
  }
  return null
}

function parseUserCache(value: unknown): AuthzUserCacheValue | null {
  if (!value || typeof value !== 'object') return null
  const record = value as Record<string, unknown>
  if (!Array.isArray(record.permissions) || !Array.isArray(record.roleSlugs)) return null
  return {
    roleIds: Array.isArray(record.roleIds)
      ? record.roleIds.map(String).filter(Boolean)
      : [],
    roleSlugs: record.roleSlugs.map(String).filter(Boolean),
    permissions: uniquePermissions(record.permissions.map(String)),
  }
}

async function findByCacheKey(payload: Payload, cacheKey: string) {
  const result = await payload.find({
    collection: AUTHZ_CACHE_SLUG,
    limit: 1,
    pagination: false,
    overrideAccess: true,
    depth: 0,
    where: { cacheKey: { equals: cacheKey } },
  })
  return result.docs[0] ?? null
}

async function upsertAuthzEntry(
  payload: Payload,
  input: {
    cacheKey: string
    scope: 'user' | 'role'
    cachedValue: AuthzUserCacheValue | AuthzRoleCacheValue
  },
): Promise<void> {
  const existing = await findByCacheKey(payload, input.cacheKey)
  const data = {
    cacheKey: input.cacheKey,
    scope: input.scope,
    cachedValue: input.cachedValue,
  }

  if (existing) {
    await payload.update({
      collection: AUTHZ_CACHE_SLUG,
      id: existing.id,
      overrideAccess: true,
      depth: 0,
      data,
    })
    return
  }

  await payload.create({
    collection: AUTHZ_CACHE_SLUG,
    overrideAccess: true,
    depth: 0,
    data,
  })
}

export async function deleteAuthzCacheKey(payload: Payload, cacheKey: string): Promise<void> {
  const existing = await findByCacheKey(payload, cacheKey)
  if (!existing) return
  await payload.delete({
    collection: AUTHZ_CACHE_SLUG,
    id: existing.id,
    overrideAccess: true,
  })
}

export async function setRoleAuthzCache(
  payload: Payload,
  roleId: string | number,
  value: AuthzRoleCacheValue,
): Promise<void> {
  await upsertAuthzEntry(payload, {
    cacheKey: roleCacheKey(roleId),
    scope: 'role',
    cachedValue: value,
  })
}

export async function setUserAuthzCache(
  payload: Payload,
  userId: string | number,
  value: AuthzUserCacheValue,
): Promise<void> {
  await upsertAuthzEntry(payload, {
    cacheKey: userCacheKey(userId),
    scope: 'user',
    cachedValue: value,
  })
}

export async function deleteUserAuthzCache(
  payload: Payload,
  userId: string | number,
): Promise<void> {
  await deleteAuthzCacheKey(payload, userCacheKey(userId))
}

export async function deleteRoleAuthzCache(
  payload: Payload,
  roleId: string | number,
): Promise<void> {
  await deleteAuthzCacheKey(payload, roleCacheKey(roleId))
}

export async function computeUserAuthzFromRoles(
  payload: Payload,
  roleRefs: unknown[] | null | undefined,
): Promise<AuthzUserCacheValue> {
  const roleIds = (roleRefs ?? []).map(asId).filter((id): id is string => Boolean(id))
  if (roleIds.length === 0) {
    return { roleIds: [], roleSlugs: [], permissions: [] }
  }

  const roles = await payload.find({
    collection: ROLES_SLUG,
    overrideAccess: true,
    depth: 0,
    pagination: false,
    limit: roleIds.length,
    where: { id: { in: roleIds } },
  })

  const roleSlugs: string[] = []
  const permissionSet = new Set<Permission>()

  for (const role of roles.docs) {
    if (typeof role.slug === 'string' && role.slug) roleSlugs.push(role.slug)
    for (const permission of role.permissions ?? []) {
      if (typeof permission === 'string') {
        const list = uniquePermissions([permission])
        for (const item of list) permissionSet.add(item)
      }
    }
  }

  return {
    roleIds,
    roleSlugs,
    permissions: [...permissionSet],
  }
}

export async function recomputeAndCacheUserAuthz(
  payload: Payload,
  userId: string | number,
  roleRefs?: unknown[] | null,
): Promise<AuthzUserCacheValue> {
  let roles = roleRefs
  if (roles === undefined) {
    const user = await payload.findByID({
      collection: 'users',
      id: userId,
      depth: 0,
      overrideAccess: true,
    })
    roles = (user as { roles?: unknown[] }).roles ?? []
  }

  const value = await computeUserAuthzFromRoles(payload, roles)
  await setUserAuthzCache(payload, userId, value)
  return value
}

export async function invalidateUsersForRole(
  payload: Payload,
  roleId: string | number,
): Promise<void> {
  const pageSize = 200
  let page = 1

  for (;;) {
    const users = await payload.find({
      collection: 'users',
      overrideAccess: true,
      depth: 0,
      limit: pageSize,
      page,
      pagination: true,
      where: { roles: { contains: roleId } },
    })

    for (const user of users.docs) {
      await recomputeAndCacheUserAuthz(payload, user.id, (user as { roles?: unknown[] }).roles)
    }

    if (!users.hasNextPage) break
    page += 1
  }
}

/** Recompute authz-cache for every user that has at least one role (paginated). */
export async function recomputeAllUserAuthzCaches(payload: Payload): Promise<number> {
  const pageSize = 200
  let page = 1
  let updated = 0

  for (;;) {
    const users = await payload.find({
      collection: 'users',
      overrideAccess: true,
      depth: 0,
      limit: pageSize,
      page,
      pagination: true,
    })

    for (const user of users.docs) {
      const roles = (user as { roles?: unknown[] }).roles
      if (!Array.isArray(roles) || roles.length === 0) continue
      await recomputeAndCacheUserAuthz(payload, user.id, roles)
      updated += 1
    }

    if (!users.hasNextPage) break
    page += 1
  }

  return updated
}

export async function getUserAuthz(
  payload: Payload,
  userId: string | number,
  req?: PayloadRequest,
): Promise<AuthzUserCacheValue> {
  const id = String(userId)

  if (req) {
    const reqMemo = req as ReqWithAuthzMemo
    const memo = (reqMemo[REQ_MEMO] ??= new Map())
    const cached = memo.get(id)
    if (cached) return cached
  }

  const entry = await findByCacheKey(payload, userCacheKey(id))
  const parsed = parseUserCache(entry?.cachedValue)
  if (parsed) {
    if (req) {
      const reqMemo = req as ReqWithAuthzMemo
      reqMemo[REQ_MEMO]?.set(id, parsed)
    }
    return parsed
  }

  const computed = await recomputeAndCacheUserAuthz(payload, id)
  if (req) {
    const reqMemo = req as ReqWithAuthzMemo
    reqMemo[REQ_MEMO]?.set(id, computed)
  }
  return computed
}

export function isSystemRoleSlug(slug: string): slug is SystemRoleSlug {
  return slug === 'super-admin' || slug === 'editor' || slug === 'author'
}
