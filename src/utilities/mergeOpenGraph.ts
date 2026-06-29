import type { Metadata } from 'next'

import { DEFAULT_SITE_NAME } from './getSiteSettings'
import { getServerSideURL } from './getURL'

export const mergeOpenGraph = (
  og?: Metadata['openGraph'],
  siteName: string = DEFAULT_SITE_NAME,
  siteDescription?: string | null,
): Metadata['openGraph'] => {
  const defaultOpenGraph: Metadata['openGraph'] = {
    type: 'website',
    description: siteDescription || 'Crispy — 基于 Payload 的通用 CMS',
    images: [
      {
        url: `${getServerSideURL()}/website-template-OG.webp`,
      },
    ],
    siteName,
    title: siteName,
  }

  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
