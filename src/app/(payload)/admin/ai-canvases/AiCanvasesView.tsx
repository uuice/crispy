import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import React from 'react'

import { canUseAiAgent } from '@/ai/agent/access'
import { AdminAiCanvasesApp } from '@/components/AdminAiCanvases/AdminAiCanvasesApp'
import { AdminCustomViewStepNav } from '@/components/AdminCustomViewStepNav'

export function AiCanvasesView({
  initPageResult,
  params,
  searchParams,
}: AdminViewServerProps) {
  const { req, permissions, visibleEntities } = initPageResult
  const user = req.user

  if (!user) {
    return (
      <Gutter>
        <p>请先登录 Admin 后使用 AI 画布。</p>
      </Gutter>
    )
  }

  if (!canUseAiAgent(user)) {
    return (
      <Gutter>
        <p>当前账号无权使用 AI 画布。</p>
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
      <AdminCustomViewStepNav label="AI 画布" viewPath="/ai-canvases" />
      <Gutter>
        <div className="admin-ai-canvases-page">
          <h1 style={{ marginBottom: 8 }}>AI 画布</h1>
          <AdminAiCanvasesApp />
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}

export default AiCanvasesView
