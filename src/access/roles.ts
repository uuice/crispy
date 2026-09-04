import type { Access, Payload, PayloadRequest } from 'payload'

import { getUserAuthz } from '@/access/authzCache'
import type { CrispyRole, SystemRoleSlug } from '@/access/permissions'

export type { CrispyRole, SystemRoleSlug }
export { SYSTEM_ROLE_SLUGS as CRISPY_ROLE_VALUES } from '@/access/permissions'

/** Extract role slugs from a user document (JWT / client). Sync — may be stale until refetch. */
export function extractRoleSlugs(
  user: { roles?: unknown } | null | undefined,
): string[] {
  const roles = user?.roles
  if (!Array.isArray(roles)) return []

  const slugs: string[] = []
  for (const role of roles) {
    if (typeof role === 'string') {
      // Legacy enum or slug string
      if (role === 'super-admin' || role === 'editor' || role === 'author') {
        slugs.push(role)
      }
      continue
    }
    if (role && typeof role === 'object' && 'slug' in role) {
      const slug = (role as { slug?: unknown }).slug
      if (typeof slug === 'string' && slug) slugs.push(slug)
    }
  }
  return slugs
}

/**
 * Sync role check from the user object (Admin UI / middleware).
 * Prefer `userHasRole` on the server when Payload is available (authz-cache, immediate).
 */
export function hasRole(
  user: { roles?: unknown } | null | undefined,
  roles: CrispyRole[],
): boolean {
  const slugs = extractRoleSlugs(user)
  return roles.some((role) => slugs.includes(role))
}

/** Server role check via authz-cache (updates apply without re-login). */
export async function userHasRole(
  user: PayloadRequest['user'],
  roles: CrispyRole[],
  payload: Payload,
  req?: PayloadRequest,
): Promise<boolean> {
  if (!user?.id) return false
  const authz = await getUserAuthz(payload, user.id, req)
  return roles.some((role) => authz.roleSlugs.includes(role))
}

/** System role gate — prefer requirePermission for resource-level checks. */
export const isSuperAdmin: Access = async ({ req }) => {
  if (!req.user) return false
  return userHasRole(req.user, ['super-admin'], req.payload, req)
}
