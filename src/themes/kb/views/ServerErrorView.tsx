import Link from 'next/link'
import React from 'react'

import type { ServerErrorPageData } from '../pages/serverError'

type Props = { data: ServerErrorPageData }

export function ServerErrorView({ data: _data }: Props) {
  return (
    <>
      <section className="kb-hero kb-hero--compact">
        <div aria-hidden="true" className="kb-hero-bg" />
        <div className="kb-container kb-hero-inner kb-hero-inner--center">
          <p className="kb-eyebrow">500</p>
          <h1 className="kb-hero-title">服务暂时不可用</h1>
          <p className="kb-hero-subtitle">请稍后再试，或返回首页继续浏览。</p>
          <Link className="kb-hero-cta" href="/">
            返回首页
          </Link>
        </div>
      </section>
    </>
  )
}
