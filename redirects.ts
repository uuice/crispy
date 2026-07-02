import type { NextConfig } from 'next'

import { legacyFrontendRedirectRules } from './src/frontend-cache/legacyFrontendRedirects'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)',
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)',
  }

  const legacyRedirects = legacyFrontendRedirectRules.map((rule) => ({
    ...rule,
    permanent: true,
  }))

  return [internetExplorerRedirect, ...legacyRedirects]
}
