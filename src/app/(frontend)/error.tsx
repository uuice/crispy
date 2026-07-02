'use client'

import Link from 'next/link'
import React from 'react'

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <article className="section-card error-page px-4 sm:px-6 py-6 sm:py-8">
      <div className="error-page-intro">
        <p className="code-label">服务器错误</p>
        <p>页面暂时无法加载，请稍后重试。</p>
      </div>
      <h1 className="error-page-title">500 Server Error</h1>
      <p className="error-page-desc">服务出现异常，我们正在处理中。</p>
      <p className="error-page-back">
        <button
          className="mr-4"
          onClick={reset}
          style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
          type="button"
        >
          重试
        </button>
        <Link href="/">← 返回首页</Link>
      </p>
    </article>
  )
}
