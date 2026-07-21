import type { Permission } from '@/access/permissions'
import { type AuthzUserShape, userHasAnyPermissionSync } from '@/access/can'

/**
 * Hide a Collection/Global from Admin nav and routes unless the user has
 * any of the given permissions. Use when `access.read` must stay public
 * (frontend / middleware) but Admin should not list the entity.
 */
export function hideUnlessAnyPermission(...permissions: Permission[]) {
  return ({ user }: { user: unknown }): boolean =>
    !userHasAnyPermissionSync(user as AuthzUserShape, permissions)
}
