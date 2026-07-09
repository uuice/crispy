import Link from 'next/link'
import React from 'react'

import { PageHeader } from '../components/PageHeader'
import type { GamesPageData } from '../pages/games'

type Props = { data: GamesPageData }

export function GamesView({ data }: Props) {
  const { games } = data

  return (
    <>
      <PageHeader eyebrow="Interactive" subtitle="站内互动内容" title="小游戏" />
      <div className="kb-container kb-page-body">
        <div className="kb-card-grid kb-card-grid--2">
          {games.map((game) => (
            <article className="kb-feature-card" key={game.url}>
              <p className="kb-eyebrow kb-eyebrow--dark">Game</p>
              <h2 className="kb-feature-title">
                <Link href={game.url} prefetch={false}>{game.title}</Link>
              </h2>
              <p className="kb-feature-desc">{game.description}</p>
              <Link className="kb-card-link" href={game.url} prefetch={false}>
                开始游戏 →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  )
}
