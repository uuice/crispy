import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

import { DEFAULT_SITE_NAME } from '@/utilities/getSiteSettings'
import { frontendLabels } from '@/i18n/frontend-labels'
import { PAGE_REVALIDATE_SECONDS } from '@/frontend-cache/constants'

export const dynamic = 'force-static'
export const revalidate = PAGE_REVALIDATE_SECONDS

const employmentLabels: Record<string, string> = {
  'full-time': '全职',
  'part-time': '兼职',
  contract: '合同',
  intern: '实习',
  remote: '远程',
}

export default async function JobsPage() {
  const payload = await getPayload({ config: configPromise })

  const jobs = await payload.find({
    collection: 'jobs',
    depth: 0,
    limit: 50,
    overrideAccess: false,
    sort: '-publishedAt',
    where: {
      enabled: {
        equals: true,
      },
    },
  })

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-12">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{frontendLabels.jobs.title}</h1>
          <p>{frontendLabels.jobs.description}</p>
        </div>
      </div>

      <div className="container">
        {jobs.docs.length === 0 ? (
          <p className="text-muted-foreground">{frontendLabels.jobs.none}</p>
        ) : (
          <ul className="divide-y border rounded-lg">
            {jobs.docs.map((job) => (
              <li key={job.id} className="p-6 hover:bg-muted/30 transition-colors">
                <Link href={`/jobs/${job.slug}`} className="block no-underline">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold m-0">{job.title}</h2>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-1">
                        {job.department && <span>{job.department}</span>}
                        {job.location && <span>{job.location}</span>}
                        {job.employmentType && (
                          <span>{employmentLabels[job.employmentType] ?? job.employmentType}</span>
                        )}
                        {job.salary && <span>{job.salary}</span>}
                      </div>
                    </div>
                    <span className="text-sm text-primary shrink-0">{frontendLabels.jobs.viewDetail} →</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: frontendLabels.jobs.title,
    description: `${DEFAULT_SITE_NAME} ${frontendLabels.jobs.description}`,
  }
}
