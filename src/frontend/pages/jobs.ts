import type { Metadata } from 'next'

import { frontendLabels } from '@/i18n/frontend-labels'

import { queryJobs } from '../data/queries'
import { JobsView } from '../views/JobsView'

export type JobsPageData = {
  jobs: Awaited<ReturnType<typeof queryJobs>>
}

export async function loadJobsPageData(): Promise<JobsPageData> {
  const jobs = await queryJobs()
  return { jobs }
}

export function jobsPageMetadata(): Metadata {
  return { title: frontendLabels.jobs.title }
}

export const jobsPage = {
  load: loadJobsPageData,
  View: JobsView,
  metadata: jobsPageMetadata,
}
