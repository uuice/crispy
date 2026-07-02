import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import React from 'react'

import { hasRole } from '@/access/roles'
import {
  FRONTEND_CACHE_GROUP_LABELS,
  FRONTEND_CACHE_REGISTRY,
} from '@/frontend-cache/registry'
import { getResolvedCacheSettings } from '@/frontend-cache/getCacheSettings'
import { getDbCacheStats, getDynamicRouteCacheEntries, getRegistryCacheStatuses } from '@/frontend-cache/dbCache'
import { AdminCustomViewStepNav } from '@/components/AdminCustomViewStepNav'

import { CacheManagePanel } from './CacheManagePanel'

export async function CacheView({
  initPageResult,
  params,
  searchParams,
}: AdminViewServerProps) {
  const { req, permissions, visibleEntities } = initPageResult
  const user = req.user

  if (!user) {
    return (
      <Gutter>
        <p>请先登录 Admin 后管理前台缓存。</p>
      </Gutter>
    )
  }

  if (!hasRole(user, ['super-admin', 'editor'])) {
    return (
      <DefaultTemplate
        i18n={req.i18n}
        locale={initPageResult.locale}
        params={params}
        payload={req.payload}
        permissions={permissions}
        searchParams={searchParams}
        user={user}
        visibleEntities={visibleEntities}
      >
        <AdminCustomViewStepNav label="缓存管理" viewPath="/cache" />
        <Gutter>
          <p>仅超级管理员与编辑可管理前台缓存。</p>
        </Gutter>
      </DefaultTemplate>
    )
  }

  const settings = await getResolvedCacheSettings()
  const [dbStats, entryStatuses, dynamicRoutes] = await Promise.all([
    getDbCacheStats(),
    getRegistryCacheStatuses(FRONTEND_CACHE_REGISTRY),
    getDynamicRouteCacheEntries(),
  ])

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      searchParams={searchParams}
      user={user}
      visibleEntities={visibleEntities}
    >
      <AdminCustomViewStepNav label="缓存管理" viewPath="/cache" />
      <Gutter>
        <CacheManagePanel
          initial={{
            settings,
            dbStats,
            entryStatuses,
            dynamicRoutes,
            entries: FRONTEND_CACHE_REGISTRY,
            groupLabels: FRONTEND_CACHE_GROUP_LABELS,
          }}
        />
      </Gutter>
    </DefaultTemplate>
  )
}

export default CacheView
