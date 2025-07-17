import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import { jobService } from '../../services/jobService'

// Validation schemas
const createJobSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  address: z.string().optional(),
  branch: z.string().optional(),
  email: z.string().email().optional(),
  nature: z.string().optional(),
  num: z.number().min(0),
  typeName: z.string().optional(),
  sort: z.number().default(0)
})

const updateJobSchema = createJobSchema.partial()

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
      num_min:
        req.query['num_min'] !== undefined ? parseInt(req.query['num_min'] as string) : undefined,
      num_max:
        req.query['num_max'] !== undefined ? parseInt(req.query['num_max'] as string) : undefined,
      sort: req.query['sort'] !== undefined ? parseInt(req.query['sort'] as string) : undefined,
      sort_min:
        req.query['sort_min'] !== undefined ? parseInt(req.query['sort_min'] as string) : undefined,
      sort_max:
        req.query['sort_max'] !== undefined ? parseInt(req.query['sort_max'] as string) : undefined,
      is_delete:
        req.query['is_delete'] !== undefined
          ? parseInt(req.query['is_delete'] as string)
          : undefined,
      update_time: req.query['update_time']
        ? parseInt(req.query['update_time'] as string)
        : undefined,
      create_time: req.query['create_time']
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

// Create new job
export const createJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createJobSchema.parse(req.body)

    const result = await jobService.createJob(validatedData)

    success(res, result, 'Job created successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error creating job:', err)
    error(res, 'Internal server error')
  }
}

// Update job
export const updateJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const validatedData = updateJobSchema.parse(req.body)

    const result = await jobService.updateJob(id, validatedData)

    if (!result.success) {
      notFound(res, 'Job not found')
      return
    }

    success(res, { id, ...validatedData }, 'Job updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error updating job:', err)
    error(res, 'Internal server error')
  }
}

// Delete job (logical delete)
export const deleteJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const result = await jobService.deleteJob(id)

    if (!result.success) {
      notFound(res, 'Job not found')
      return
    }

    success(res, null, 'Job deleted successfully')
  } catch (err: unknown) {
    console.error('Error deleting job:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const jobController = {
  getJob,
  getJobs,
  createJob,
  updateJob,
  deleteJob
}
