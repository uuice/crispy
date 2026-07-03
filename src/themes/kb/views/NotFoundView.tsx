import Link from 'next/link'
import React from 'react'

import type { NotFoundPageData } from '../pages/notFound'

type Props = { data: NotFoundPageData }

export function NotFoundView({ data }: Props) {
  const { menu } = data

  return (
    <>
      <section className="kb-hero kb-hero--compact">
        <div aria-hidden="true" className="kb-hero-bg" />
        <div className="kb-container kb-hero-inner kb-hero-inner--center">
          <p className="kb-eyebrow">404</p>
          <h1 className="kb-hero-title">页面未找到</h1>
          <p className="kb-hero-subtitle">你访问的路径不存在，或内容已被移除。</p>
        </div>
      </section>
      <div className="kb-container kb-page-body">
        <div className="kb-error-panel">
          <p className="kb-section-desc">你可以前往以下页面</p>
          <ul className="kb-error-links">
            {menu.map((item) => (
              <li key={item.url + item.title}>
                <Link href={item.url} target={item.target || '_self'}>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link className="kb-hero-cta" href="/">
            返回首页
          </Link>
        </div>
      </div>
    </>
  )
}
