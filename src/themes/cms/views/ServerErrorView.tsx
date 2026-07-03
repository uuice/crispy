import Link from 'next/link'
import React from 'react'

import type { ServerErrorPageData } from '../pages/serverError'

type Props = { data: ServerErrorPageData }

export function ServerErrorView({ data: _data }: Props) {
  return (
    <>
      <section className="cms-hero cms-hero--compact">
        <div aria-hidden="true" className="cms-hero-bg" />
        <div className="cms-container cms-hero-inner cms-hero-inner--center">
          <p className="cms-eyebrow">500</p>
          <h1 className="cms-hero-title">服务暂时不可用</h1>
          <p className="cms-hero-subtitle">请稍后再试，或返回首页继续浏览。</p>
          <Link className="cms-hero-cta" href="/">
            返回首页
          </Link>
        </div>
      </section>
    </>
  )
}
