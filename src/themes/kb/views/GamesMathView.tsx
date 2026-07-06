import Link from 'next/link'
import React from 'react'

import { MathPixiGame } from '../components/MathPixiGameShell'
import { PageHeader } from '../components/PageHeader'
import type { GamesMathPageData } from '../pages/gamesMath'

type Props = { data: GamesMathPageData }

export function GamesMathView({ data: _data }: Props) {
  return (
    <>
      <PageHeader
        eyebrow="Game"
        stats={
          <Link className="kb-hero-cta kb-hero-cta--ghost" href="/games">
            返回游戏列表
          </Link>
        }
        subtitle="支持难度与题型设置 · 10 题计分 · 支持全屏"
        title="算术挑战"
      />
      <div className="kb-container kb-page-body">
        <div className="kb-game-panel">
          <MathPixiGame />
        </div>
      </div>
    </>
  )
}
