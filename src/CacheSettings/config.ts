import type { GlobalConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { isEditor } from '@/access/roles'
import { adminLabels } from '@/i18n/admin-labels'
import {
  DEFAULT_DATA_CACHE_REVALIDATE,
  DEFAULT_PAGE_REVALIDATE,
} from '@/frontend-cache/constants'

import { revalidateCacheSettings } from './hooks/revalidateCacheSettings'

export const CacheSettings: GlobalConfig = {
  slug: 'cache-settings',
  label: adminLabels.cacheSettings,
  access: {
    read: anyone,
    update: isEditor,
  },
  admin: {
    group: adminLabels.systemGroup,
  },
  fields: [
    {
      name: 'cachingEnabled',
      type: 'checkbox',
      label: adminLabels.cacheEnabled,
      defaultValue: true,
      admin: {
        description: '关闭后仍可通过「缓存管理」手动刷新；数据层建议在发布后执行缓存清除。',
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
          'DB 路由缓存 TTL（秒），用于 middleware X-Crispy-Page-Cache 与 route 条目过期。与代码中 export const revalidate 无关，后者为 Next.js 生产环境可选第二层。',
      },
    },
    {
      name: 'dataCacheRevalidateSeconds',
      type: 'number',
      label: adminLabels.dataCacheRevalidateSeconds,
      defaultValue: DEFAULT_DATA_CACHE_REVALIDATE,
      min: 0,
      admin: {
        description: '数据查询结果缓存过期时间（秒），保存在数据库。',
      },
    },
    {
      name: 'exposeCacheHeaders',
      type: 'checkbox',
      label: adminLabels.exposeCacheHeaders,
      defaultValue: true,
      admin: {
        description:
          '在 HTTP 响应中输出 X-Crispy-Page-Cache / X-Crispy-Data-Cache 等调试头（HIT/MISS/STALE/BYPASS）。',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateCacheSettings],
  },
}
