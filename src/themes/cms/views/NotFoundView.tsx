import Link from 'next/link'
import React from 'react'

import type { NotFoundPageData } from '../pages/notFound'

type Props = { data: NotFoundPageData }

export function NotFoundView({ data }: Props) {
  const { menu } = data

  return (
    <>
      <section className="cms-hero cms-hero--compact">
        <div aria-hidden="true" className="cms-hero-bg" />
        <div className="cms-container cms-hero-inner cms-hero-inner--center">
          <p className="cms-eyebrow">404</p>
          <h1 className="cms-hero-title">页面未找到</h1>
          <p className="cms-hero-subtitle">你访问的路径不存在，或内容已被移除。</p>
        </div>
      </section>
      <div className="cms-container cms-page-body">
        <div className="cms-error-panel">
          <p className="cms-section-desc">你可以前往以下页面</p>
          <ul className="cms-error-links">
            {menu.map((item) => (
              <li key={item.url + item.title}>
                <Link href={item.url} target={item.target || '_self'}>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link className="cms-hero-cta" href="/">
            返回首页
          </Link>
        </div>
      </div>
    </>
  )
}
