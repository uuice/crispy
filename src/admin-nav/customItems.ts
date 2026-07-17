import { adminLabels } from '@/i18n/admin-labels'

export type CustomAdminNavItem = {
  group: string
  label: string
  path: `/${string}`
}

/** Custom admin views merged into existing Payload nav groups. */
export const CUSTOM_ADMIN_NAV_ITEMS: CustomAdminNavItem[] = [
  { path: '/ai-agent', label: 'AI 内容助手', group: adminLabels.operationsGroup },
  { path: '/ai-canvases', label: 'AI 画布', group: adminLabels.operationsGroup },
  { path: '/stats', label: '内容统计', group: adminLabels.contentGroup },
  { path: '/cache', label: '缓存管理', group: adminLabels.configGroup },
  { path: '/api-docs', label: 'Swagger API', group: adminLabels.devGroup },
  { path: '/dev-docs', label: '二次开发文档', group: adminLabels.devGroup },
]

/** Preferred sidebar group order (unknown groups append at the end). */
export const ADMIN_NAV_GROUP_ORDER: string[] = [
  adminLabels.contentGroup,
  adminLabels.novelGroup,
  adminLabels.operationsGroup,
  adminLabels.configGroup,
  adminLabels.importExportGroup,
  adminLabels.systemGroup,
  adminLabels.devGroup,
]
