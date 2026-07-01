import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import React from 'react'

import { DevDocsContent } from './DevDocsContent'
import { AdminCustomViewStepNav } from '@/components/AdminCustomViewStepNav'

export function DevDocsView({
  initPageResult,
  params,
  searchParams,
}: AdminViewServerProps) {
  const { req, permissions, visibleEntities } = initPageResult
  const user = req.user

  if (!user) {
    return (
      <Gutter>
        <p>请先登录 Admin 后查看二次开发文档。</p>
      </Gutter>
    )
  }

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
      <AdminCustomViewStepNav label="二次开发文档" viewPath="/dev-docs" />
      <Gutter>
        <DevDocsContent />
      </Gutter>
    </DefaultTemplate>
  )
}

export default DevDocsView
