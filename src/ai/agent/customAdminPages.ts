import type { Permission } from '@/access/permissions'
import { adminLabels } from '@/i18n/admin-labels'

export type CustomAdminPage = {
  group: string
  label: string
  path: `/${string}`
  /** Shown when the user has any of these permissions. Omit = any Admin user. */
  anyOf?: Permission[]
}

/**
 * Custom Admin views listed in the official sidebar via afterNavLinks
 * (group「工具」) and in Agent `list_admin_menu`.
 */
export const CUSTOM_ADMIN_PAGES: CustomAdminPage[] = [
  {
    path: '/ai-agent',
    label: 'AI 内容助手',
    group: adminLabels.toolsGroup,
    anyOf: ['ai:use'],
  },
  {
    path: '/stats',
    label: '内容统计',
    group: adminLabels.toolsGroup,
    anyOf: ['stats:read'],
  },
  {
    path: '/cache',
    label: '缓存管理',
    group: adminLabels.toolsGroup,
    anyOf: ['cache:manage'],
  },
  { path: '/api-docs', label: 'Swagger API', group: adminLabels.toolsGroup },
]
