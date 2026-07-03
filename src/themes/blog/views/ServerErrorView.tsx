import Link from 'next/link'
import React from 'react'

import type { ServerErrorPageData } from '../pages/serverError'
import { Banner } from '../components/Banner'

type Props = {
  data: ServerErrorPageData
}

export function ServerErrorView({ data: _data }: Props) {
  return (
    <>
      <Banner subtitle="服务器内部错误" title="500" />
      <article className="section-card error-page px-4 sm:px-6 py-6 sm:py-8">
        <div className="error-page-intro">
          <p className="code-label">服务器错误</p>
          <p>页面暂时无法加载，请稍后重试。</p>
        </div>
        <h1 className="error-page-title">500 Server Error</h1>
        <p className="error-page-back">
          <Link href="/">← 返回首页</Link>
        </p>
      </article>
    </>
  )
}
