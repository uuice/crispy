import type { Access, PayloadRequest } from 'payload'

export type CrispyRole = 'super-admin' | 'editor' | 'author'

export const CRISPY_ROLES: { label: string; value: CrispyRole }[] = [
  { label: '超级管理员', value: 'super-admin' },
  { label: '编辑', value: 'editor' },
  { label: '作者', value: 'author' },
]

export function userRoles(user: PayloadRequest['user']): CrispyRole[] {
  const roles = (user as { roles?: CrispyRole[] } | null)?.roles
  return roles ?? []
}

export function hasRole(user: PayloadRequest['user'], roles: CrispyRole[]): boolean {
  return userRoles(user).some((role) => roles.includes(role))
}

export const isSuperAdmin: Access = ({ req: { user } }) => hasRole(user, ['super-admin'])

export const isEditor: Access = ({ req: { user } }) =>
  hasRole(user, ['super-admin', 'editor'])

export const isAuthorOrAbove: Access = ({ req: { user } }) =>
  hasRole(user, ['super-admin', 'editor', 'author'])
