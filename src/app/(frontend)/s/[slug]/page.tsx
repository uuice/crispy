import { redirect } from 'next/navigation'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const revalidate = false

type Args = {
  params: Promise<{ slug: string }>
}

export default async function ShortLinkPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'redirects',
    limit: 1,
    overrideAccess: false,
    where: {
      from: { equals: `/s/${decodeURIComponent(slug)}` },
    },
  })

  const entry = result.docs[0]
  if (!entry?.to?.url) redirect('/404')

  const target = entry.to.url
  if (target.startsWith('http://') || target.startsWith('https://')) {
    redirect(target)
  }

  redirect(target.startsWith('/') ? target : `/${target}`)
}
