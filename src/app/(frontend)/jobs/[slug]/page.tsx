import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import RichText from '@/components/RichText'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { DEFAULT_SITE_NAME, getSiteName } from '@/utilities/getSiteSettings'

export const revalidate = false

const employmentLabels: Record<string, string> = {
  'full-time': '全职',
  'part-time': '兼职',
  contract: '合同',
  intern: '实习',
  remote: '远程',
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const jobs = await payload.find({
    collection: 'jobs',
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    where: {
      enabled: {
        equals: true,
      },
    },
    select: {
      slug: true,
    },
  })

  return jobs.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function JobPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = `/jobs/${decodedSlug}`
  const job = await queryJobBySlug({ slug: decodedSlug })

  if (!job) return <PayloadRedirects url={url} />

  return (
    <article className="pt-24 pb-24">
      <PayloadRedirects disableNotFound url={url} />

      <div className="container max-w-3xl">
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-4">{job.title}</h1>
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            {job.department && <span>{job.department}</span>}
            {job.location && <span>{job.location}</span>}
            {job.employmentType && (
              <span>{employmentLabels[job.employmentType] ?? job.employmentType}</span>
            )}
            {job.salary && <span>{job.salary}</span>}
          </div>
        </header>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">职位描述</h2>
          <RichText data={job.description} enableGutter={false} />
        </section>

        {job.requirements && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">任职要求</h2>
            <RichText data={job.requirements} enableGutter={false} />
          </section>
        )}
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const job = await queryJobBySlug({ slug: decodeURIComponent(slug) })
  const siteName = await getSiteName()

  return {
    title: job ? `${job.title} | ${siteName}` : `招聘 | ${DEFAULT_SITE_NAME}`,
  }
}

const queryJobBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'jobs',
    depth: 0,
    limit: 1,
    overrideAccess: false,
    where: {
      and: [
        { slug: { equals: slug } },
        { enabled: { equals: true } },
      ],
    },
  })

  return result.docs[0] ?? null
})
