import type React from 'react'
import { notFound, redirect } from 'next/navigation'

import { resolveRedirectDestination } from '@/redirects/resolveRedirectDestination'
import { getCachedRedirects } from '@/utilities/getRedirects'

interface Props {
  disableNotFound?: boolean
  url: string
}

/* SSR fallback when middleware redirect map misses a path */
export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, url }) => {
  const redirects = await getCachedRedirects()

  const redirectItem = redirects.find((entry) => entry.from === url)

  if (redirectItem) {
    const destination = resolveRedirectDestination(redirectItem)
    if (destination) {
      redirect(destination)
    }
  }

  if (disableNotFound) return null

  notFound()
}
