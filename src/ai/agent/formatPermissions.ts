import type { AuthzUserCacheValue } from '@/access/authzCache'
import { PERMISSION_CATALOG, type Permission } from '@/access/permissions'

const LABEL_BY_VALUE = new Map(
  PERMISSION_CATALOG.map((entry) => [entry.value, `${entry.group} · ${entry.label}`]),
)

export type AgentAuthzContext = {
  roleSlugs: string[]
  permissions: Permission[]
}

export function toAgentAuthzContext(authz: AuthzUserCacheValue): AgentAuthzContext {
  return {
    roleSlugs: authz.roleSlugs,
    permissions: authz.permissions,
  }
}

/** Structured payload for get_my_permissions / system prompt. */
export function formatAgentPermissions(authz: AgentAuthzContext) {
  const permissions = authz.permissions.map((value) => ({
    value,
    label: LABEL_BY_VALUE.get(value) ?? value,
  }))

  return {
    roleSlugs: authz.roleSlugs,
    permissionCount: permissions.length,
    permissions,
  }
}

export function formatAgentPermissionsPromptBlock(authz: AgentAuthzContext): string {
  const formatted = formatAgentPermissions(authz)
  const roles =
    formatted.roleSlugs.length > 0 ? formatted.roleSlugs.join(', ') : '（无角色）'
  const lines =
    formatted.permissions.length > 0
      ? formatted.permissions.map((entry) => `- ${entry.value}（${entry.label}）`).join('\n')
      : '- （无权限）'

  return `## 当前用户权限（权威来源，勿编造）
- 角色 slug：${roles}
- Permission 列表（共 ${formatted.permissionCount} 项）：
${lines}

用户询问「我有什么权限 / 角色」时：必须先调用 get_my_permissions（或直接引用本节列表），按实际返回回答；禁止根据上文「能力」清单臆测未授予的权限。`
}
