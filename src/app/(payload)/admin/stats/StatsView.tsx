import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import React from 'react'

import { can } from '@/access/can'
import { collectCollectionStats } from '@/admin-stats/collectCollectionStats'
import { AdminCustomViewStepNav } from '@/components/AdminCustomViewStepNav'

import { StatsContent } from './StatsContent'

export async function StatsView({
  initPageResult,
  params,
  searchParams,
}: AdminViewServerProps) {
  const { req, permissions, visibleEntities } = initPageResult
  const user = req.user

  if (!user) {
    return (
      <Gutter>
        <p>请先登录 Admin 后查看内容统计。</p>
      </Gutter>
    )
  }

  if (!(await can(user, 'stats:read', req))) {
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
        <AdminCustomViewStepNav label="内容统计" viewPath="/stats" />
        <Gutter>
          <p>仅超级管理员与编辑可查看内容统计。</p>
        </Gutter>
      </DefaultTemplate>
    )
  }

  const stats = await collectCollectionStats(req.payload, req)

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
      <AdminCustomViewStepNav label="内容统计" viewPath="/stats" />
      <Gutter>
        <StatsContent stats={stats} />
      </Gutter>
    </DefaultTemplate>
  )
}

export default StatsView
