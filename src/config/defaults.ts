import type { AppConfigDefaults } from '@/config/types'

/** Fallback values when a config key is not stored in the database yet. */
export const DEFAULT_APP_CONFIGS: AppConfigDefaults = {
  'site.maintenanceMode': {
    label: '维护模式',
    category: 'general',
    valueType: 'boolean',
    value: false,
    description: '开启后前台可显示维护提示（需前台集成）。',
  },
  'features.enableSearch': {
    label: '启用站内搜索',
    category: 'features',
    valueType: 'boolean',
    value: true,
  },
  'comments.pageSize': {
    label: '评论分页大小',
    category: 'comments',
    valueType: 'number',
    value: 20,
  },
}
