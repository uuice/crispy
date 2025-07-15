import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import { jobService } from '../../services/jobService'

// Get single job
export const getJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const job = await jobService.getJobById(id)

    if (!job) {
      notFound(res, 'Job not found')
      return
    }

    success(res, job)
  } catch (err: unknown) {
    console.error('Error fetching job:', err)
    error(res, 'Internal server error')
  }
}

// Get jobs list with pagination
export const getJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10

    const filters = {
      title: req.query['title'] as string | undefined,
      typeName: req.query['typeName'] as string | undefined,
      nature: req.query['nature'] as string | undefined,
      branch: req.query['branch'] as string | undefined,
      address: req.query['address'] as string | undefined,
      email: req.query['email'] as string | undefined,
      content: req.query['content'] as string | undefined,
      num: req.query['num'] !== undefined ? parseInt(req.query['num'] as string) : undefined,
      sort: req.query['sort'] !== undefined ? parseInt(req.query['sort'] as string) : undefined,
      is_delete:
        req.query['is_delete'] !== undefined
          ? parseInt(req.query['is_delete'] as string)
          : undefined,
      update_time:
        req.query['update_time'] !== undefined
          ? parseInt(req.query['update_time'] as string)
          : undefined,
      create_time:
        req.query['create_time'] !== undefined
          ? parseInt(req.query['create_time'] as string)
          : undefined,
      start_time:
        req.query['start_time'] !== undefined
          ? parseInt(req.query['start_time'] as string)
          : undefined,
      end_time:
        req.query['end_time'] !== undefined ? parseInt(req.query['end_time'] as string) : undefined
    }
    const result = await jobService.getJobs(filters, { page, pageSize })
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching jobs:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const jobController = {
  getJob,
  getJobs
}
