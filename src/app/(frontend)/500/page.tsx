import type { Metadata } from 'next'
import React from 'react'

import { Banner } from '@/components/BlogSkin/Banner'
import Link from 'next/link'

export const revalidate = false

export default function ServerErrorPage() {
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

export const metadata: Metadata = {
  title: '500',
}
