import type { Metadata } from 'next'

import { ServerErrorView } from '../views/ServerErrorView'

export type ServerErrorPageData = Record<string, never>

export async function loadServerErrorPageData(): Promise<ServerErrorPageData> {
  return {}
}

export function serverErrorPageMetadata(): Metadata {
  return { title: '500' }
}

export const serverErrorPage = {
  load: loadServerErrorPageData,
  View: ServerErrorView,
  metadata: serverErrorPageMetadata,
}
