import type { GlobalConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { isEditor } from '@/access/roles'
import { adminLabels } from '@/i18n/admin-labels'
import { DEFAULT_PAGE_REVALIDATE } from '@/frontend-cache/constants'

import { revalidateCacheSettings } from './hooks/revalidateCacheSettings'

export const CacheSettings: GlobalConfig = {
  slug: 'cache-settings',
  label: adminLabels.cacheSettings,
  access: {
    read: anyone,
    update: isEditor,
  },
  admin: {
    group: adminLabels.configGroup,
  },
  fields: [
    {
      name: 'cachingEnabled',
      type: 'checkbox',
      label: adminLabels.cacheEnabled,
      defaultValue: true,
      admin: {
        description: '关闭后 middleware 不再从 DB 直出 HTML；仍可通过「缓存管理」手动清除。',
      },
    },
    {
      name: 'pageRevalidateSeconds',
      type: 'number',
      label: adminLabels.pageRevalidateSeconds,
      defaultValue: DEFAULT_PAGE_REVALIDATE,
      min: 0,
      admin: {
        description:
          '前台页面 HTML 缓存 TTL（秒）：middleware DB 直出、route 条目过期与定时清理均使用此值。',
      },
    },
    {
      name: 'exposeCacheHeaders',
      type: 'checkbox',
      label: adminLabels.exposeCacheHeaders,
      defaultValue: true,
      admin: {
        description:
          '在 HTTP 响应中输出 X-Crispy-Page-Cache 等调试头（HIT/MISS/STALE/BYPASS）。',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateCacheSettings],
  },
}
