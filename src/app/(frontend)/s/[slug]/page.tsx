import { redirect } from 'next/navigation'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const revalidate = false

type Args = {
  params: Promise<{ slug: string }>
}

function resolveRedirectTarget(targetUrl: string): string {
  if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
    return targetUrl
  }

  return targetUrl.startsWith('/') ? targetUrl : `/${targetUrl}`
}

export default async function ShortLinkPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'short-links',
    limit: 1,
    overrideAccess: false,
    where: {
      slug: { equals: decodeURIComponent(slug) },
    },
  })

  const entry = result.docs[0]
  if (!entry?.targetUrl) redirect('/404')

  redirect(resolveRedirectTarget(entry.targetUrl))
}
