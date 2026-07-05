import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter, Link } from '@payloadcms/ui'
import React from 'react'

import { SwaggerUIView } from './SwaggerUIView'
import { getOpenApiDocumentJson } from '@/openapi/getDocument'
import { AdminCustomViewStepNav } from '@/components/AdminCustomViewStepNav'

export async function SwaggerView({
  initPageResult,
  params,
  searchParams,
}: AdminViewServerProps) {
  const { req, permissions, visibleEntities } = initPageResult
  const user = req.user

  if (!user) {
    return (
      <Gutter>
        <p>请先登录 Admin 后查看 API 文档。</p>
      </Gutter>
    )
  }

  const spec = JSON.parse(await getOpenApiDocumentJson()) as Record<string, unknown>

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
      <AdminCustomViewStepNav label="Swagger API 文档" viewPath="/api-docs" />
      <Gutter>
        <header style={{ marginBottom: '1rem' }}>
          <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 700 }}>
            Swagger API 文档
          </h1>
          <p style={{ margin: 0, color: 'var(--theme-elevation-600)', lineHeight: 1.5 }}>
            根据 Payload 配置<strong>自动生成</strong>，包含全部 Collection / Global REST、AI、MCP、GraphQL
            等路由。OpenAPI JSON（需登录）：
            <Link href="/api/openapi.json" prefetch={false} style={{ marginLeft: '0.25rem' }}>
              /api/openapi.json
            </Link>
            {' · '}
            更新静态文件：<code>pnpm cli generate:openapi</code>
            {' · '}
            主题随 Admin 浅色/深色自动切换
          </p>
        </header>
        <SwaggerUIView spec={spec} />
      </Gutter>
    </DefaultTemplate>
  )
}

export default SwaggerView
