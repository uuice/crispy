import React from 'react'

import { adminLabels } from '@/i18n/admin-labels'
import { frontendLabels } from '@/i18n/frontend-labels'

import type { JobsPageData } from '../pages/jobs'
import { Banner } from '../components/Banner'

const employmentTypeLabels: Record<string, string> = {
  'full-time': adminLabels.employmentFullTime,
  'part-time': adminLabels.employmentPartTime,
  contract: adminLabels.employmentContract,
  intern: adminLabels.employmentIntern,
  remote: adminLabels.employmentRemote,
}

type Props = {
  data: JobsPageData
}

export function JobsView({ data }: Props) {
  const { jobs } = data

  return (
    <>
      <Banner subtitle={frontendLabels.jobs.description} title={frontendLabels.jobs.title} />
      <div className="intro-bubble animate-in animate-in-delay-1">
        <p className="m-0 code-label">
          共 <strong>{jobs.length}</strong> 个开放职位
        </p>
      </div>
      <section className="space-y-4">
        {jobs.length > 0 ? (
          jobs.map((job, i) => (
            <article
              className="section-card p-5 sm:p-6 animate-in"
              key={job.id}
              style={{ animationDelay: `${0.1 + i * 0.05}s` }}
            >
              <h2 className="content-title">{job.title}</h2>
              <p className="code-label flex flex-wrap gap-x-3 gap-y-1">
                {job.department ? <span>部门：{job.department}</span> : null}
                {job.location ? <span>地点：{job.location}</span> : null}
                {job.employmentType ? (
                  <span>类型：{employmentTypeLabels[job.employmentType] || job.employmentType}</span>
                ) : null}
                {job.salary ? <span>薪资：{job.salary}</span> : null}
              </p>
            </article>
          ))
        ) : (
          <p className="code-label">{frontendLabels.jobs.none}</p>
        )}
      </section>
    </>
  )
}
