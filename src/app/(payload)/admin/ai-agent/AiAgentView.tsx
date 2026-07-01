import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import React from 'react'

import { AdminAiAgentChatPanel } from '@/components/AdminAiAgent/AdminAiAgentChatPanel'
import { AdminCustomViewStepNav } from '@/components/AdminCustomViewStepNav'

export function AiAgentView({
  initPageResult,
  params,
  searchParams,
}: AdminViewServerProps) {
  const { req, permissions, visibleEntities } = initPageResult
  const user = req.user

  if (!user) {
    return (
      <Gutter>
        <p>请先登录 Admin 后使用 AI 内容助手。</p>
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
      <AdminCustomViewStepNav label="AI 内容助手" viewPath="/ai-agent" />
      <Gutter>
        <div className="admin-ai-agent-page">
          <h1 style={{ marginBottom: 8 }}>AI 内容助手</h1>
          <p className="admin-ai-agent-page__intro">
            通过自然语言查询、新增、修改和删除站点内容。支持文章、页面、分类、标签、媒体等所有主要资源，以及页头、页脚、站点设置等全局配置。
          </p>
          <AdminAiAgentChatPanel variant="page" />
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}

export default AiAgentView
