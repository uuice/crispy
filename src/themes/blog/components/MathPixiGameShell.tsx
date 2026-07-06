'use client'

import dynamic from 'next/dynamic'
import React, { Component, type ReactNode } from 'react'

const MathPixiGameLazy = dynamic(
  () => import('./MathPixiGame').then((mod) => ({ default: mod.MathPixiGame })),
  {
    ssr: false,
    loading: () => (
      <div
        className="math-pixi-shell mx-auto max-w-full overflow-hidden rounded-xl border section-card p-6"
        style={{ borderColor: 'var(--card-border)' }}
      >
        <p className="m-0 code-label">加载游戏中…</p>
      </div>
    ),
  },
)

type Props = {
  fallbackClassName?: string
}

type State = {
  failed: boolean
}

class MathPixiGameBoundary extends Component<{ children: ReactNode; fallbackClassName?: string }, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error) {
    console.error('[MathPixiGame] render failed', error)
  }

  render() {
    if (this.state.failed) {
      return (
        <div
          className={
            this.props.fallbackClassName ??
            'math-pixi-shell mx-auto max-w-full overflow-hidden rounded-xl border section-card p-6'
          }
          style={{ borderColor: 'var(--card-border)' }}
        >
          <p className="m-0 code-label">游戏加载失败，请刷新页面重试。</p>
        </div>
      )
    }

    return this.props.children
  }
}

export function MathPixiGameShell({ fallbackClassName }: Props) {
  return (
    <MathPixiGameBoundary fallbackClassName={fallbackClassName}>
      <MathPixiGameLazy />
    </MathPixiGameBoundary>
  )
}

export { MathPixiGameShell as MathPixiGame }
