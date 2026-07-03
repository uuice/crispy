import React from 'react'

import { adminLabels } from '@/i18n/admin-labels'
import { frontendLabels } from '@/i18n/frontend-labels'

import { PageHeader } from '../components/PageHeader'
import type { JobsPageData } from '../pages/jobs'

const employmentTypeLabels: Record<string, string> = {
  'full-time': adminLabels.employmentFullTime,
  'part-time': adminLabels.employmentPartTime,
  contract: adminLabels.employmentContract,
  intern: adminLabels.employmentIntern,
  remote: adminLabels.employmentRemote,
}

type Props = { data: JobsPageData }

export function JobsView({ data }: Props) {
  const { jobs } = data

  return (
    <>
      <PageHeader
        eyebrow="Careers"
        stats={<span className="kb-stat-pill">{jobs.length} 个职位</span>}
        subtitle={frontendLabels.jobs.description}
        title={frontendLabels.jobs.title}
      />
      <div className="kb-container kb-page-body">
        {jobs.length > 0 ? (
          <div className="kb-card-grid kb-card-grid--1">
            {jobs.map((job) => (
              <article className="kb-job-card" key={job.id}>
                <h2 className="kb-job-title">{job.title}</h2>
                <div className="kb-job-meta">
                  {job.department ? <span>{job.department}</span> : null}
                  {job.location ? <span>{job.location}</span> : null}
                  {job.employmentType ? (
                    <span>{employmentTypeLabels[job.employmentType] || job.employmentType}</span>
                  ) : null}
                  {job.salary ? <span>{job.salary}</span> : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="kb-empty">{frontendLabels.jobs.none}</p>
        )}
      </div>
    </>
  )
}
