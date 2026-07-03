import Link from 'next/link'
import React from 'react'

import type { GamesMathPageData } from '../pages/gamesMath'
import { MathPixiGame } from '../components/MathPixiGame'

type Props = {
  data: GamesMathPageData
}

export function GamesMathView({ data: _data }: Props) {
  return (
    <>
      <div className="intro-bubble animate-in">
        <p className="m-0 code-label">
          支持难度与题型设置（加减乘除可多选）· 10 题 ×10 分 · 支持全屏与统计 ·{' '}
          <Link className="nav-link-cute" href="/games" style={{ color: 'var(--accent)' }}>
            返回游戏列表
          </Link>
        </p>
      </div>
      <section className="animate-in animate-in-delay-1">
        <h2 className="section-title mb-4">算术挑战</h2>
        <MathPixiGame />
      </section>
    </>
  )
}
