import Link from 'next/link'
import React from 'react'

import { getPagePath, getPostsListPath } from '@/utilities/frontendPaths'
import { querySidebarData } from '@/utilities/queryFrontendData'

const defaultMenu: { title: string; url: string; target?: string }[] = [
  { title: '首页', url: '/' },
  { title: '文章', url: getPostsListPath() },
  { title: '友链', url: '/links' },
  { title: '关于', url: getPagePath('about') },
]

export default async function NotFound() {
  const sidebar = await querySidebarData()
  const menu = sidebar.menu.length > 0 ? sidebar.menu : defaultMenu

  return (
    <article className="section-card error-page px-4 sm:px-6 py-6 sm:py-8">
      <div className="error-page-intro">
        <p className="code-label">页面未找到</p>
        <p>你访问的页面不存在或已被移除。</p>
      </div>
      <h1 className="error-page-title">404 Not Found</h1>
      <p className="error-page-desc">当前路径不存在，可能已被移除或输入有误。</p>
      <div className="error-page-nav">
        <p className="code-label">你可以访问以下页面</p>
        <p className="error-page-nav-caption">可去的目录：</p>
        <ul className="error-page-nav-list">
          {menu.map((item) => (
            <li key={item.url + item.title}>
              <Link href={item.url} target={item.target || '_self'}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <p className="error-page-back">
        <Link href="/">← 返回首页</Link>
      </p>
    </article>
  )
}
