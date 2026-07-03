import type { Metadata } from 'next'

import { GamesMathView } from '../views/GamesMathView'

export type GamesMathPageData = Record<string, never>

export async function loadGamesMathPageData(): Promise<GamesMathPageData> {
  return {}
}

export function gamesMathPageMetadata(): Metadata {
  return { title: '算术挑战' }
}

export const gamesMathPage = {
  load: loadGamesMathPageData,
  View: GamesMathView,
  metadata: gamesMathPageMetadata,
}
