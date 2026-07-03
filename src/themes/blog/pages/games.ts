import type { Metadata } from 'next'

import { GamesView } from '../views/GamesView'

export type GameEntry = {
  title: string
  description: string
  url: string
}

export type GamesPageData = {
  games: GameEntry[]
}

export async function loadGamesPageData(): Promise<GamesPageData> {
  return {
    games: [
      {
        title: '算术挑战',
        description: 'PixiJS · 口算练习',
        url: '/games/math',
      },
    ],
  }
}

export function gamesPageMetadata(): Metadata {
  return { title: '小游戏' }
}

export const gamesPage = {
  load: loadGamesPageData,
  View: GamesView,
  metadata: gamesPageMetadata,
}
