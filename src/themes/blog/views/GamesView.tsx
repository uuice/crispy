import Link from 'next/link'
import React from 'react'

import type { GamesPageData } from '../pages/games'
import { Banner } from '../components/Banner'

type Props = {
  data: GamesPageData
}

export function GamesView({ data }: Props) {
  const { games } = data

  return (
    <>
      <Banner subtitle="轻量互动 · 学习与摸鱼皆可；后续会陆续增加更多条目" title="小游戏" />
      <div className="intro-bubble animate-in animate-in-delay-1">
        <p className="m-0 code-label">
          已上线 <strong>{games.length}</strong> 个小游戏
        </p>
      </div>
      <section className="space-y-5 animate-in animate-in-delay-2">
        <h2 className="section-title">游戏列表</h2>
        <div className="section-card p-0 overflow-hidden">
          <ul className="terminal-list m-0">
            {games.map((game) => (
              <li key={game.url}>
                <Link
                  className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-4 px-4 border-b transition-colors hover:bg-(--card-border)/30"
                  href={game.url}
                  style={{ borderColor: 'var(--card-border)' }}
                >
                  <span>
                    <span className="font-semibold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
                      {game.title}
                    </span>
                    <span className="code-label ml-2">{game.description}</span>
                  </span>
                  <span className="code-label shrink-0">进入 →</span>
                </Link>
              </li>
            ))}
            <li className="py-4 px-4 code-label">
              <span className="opacity-80">更多小游戏即将上线…</span>
            </li>
          </ul>
        </div>
      </section>
    </>
  )
}
