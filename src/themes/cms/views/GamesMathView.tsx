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
          <Link className="cms-hero-cta cms-hero-cta--ghost" href="/games" prefetch={false}>
            返回游戏列表
          </Link>
        }
        subtitle="支持难度与题型设置 · 10 题计分 · 支持全屏"
        title="算术挑战"
      />
      <div className="cms-container cms-page-body">
        <div className="cms-game-panel">
          <MathPixiGame />
        </div>
      </div>
    </>
  )
}
