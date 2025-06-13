import { db } from '@src/libs/db'
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'

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

    const job = await db
      .selectFrom('jobs')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

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
    const offset = (page - 1) * pageSize

    // Get filters from query
    const title = req.query['title'] as string | undefined
    const typeName = req.query['typeName'] as string | undefined
    const nature = req.query['nature'] as string | undefined
    const branch = req.query['branch'] as string | undefined
    const startTime = req.query['start_time']
      ? parseInt(req.query['start_time'] as string)
      : undefined
    const endTime = req.query['end_time'] ? parseInt(req.query['end_time'] as string) : undefined

    let query = db.selectFrom('jobs').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (title) {
      query = query.where('title', 'like', `%${title}%`)
    }
    if (typeName) {
      query = query.where('typeName', 'like', `%${typeName}%`)
    }
    if (nature) {
      query = query.where('nature', 'like', `%${nature}%`)
    }
    if (branch) {
      query = query.where('branch', 'like', `%${branch}%`)
    }
    if (startTime) {
      query = query.where('create_time', '>=', startTime)
    }
    if (endTime) {
      query = query.where('create_time', '<=', endTime)
    }

    // Order by create_time desc by default
    query = query.orderBy('create_time', 'desc')

    const [jobs, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    success(res, {
      data: jobs,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    })
  } catch (err: unknown) {
    console.error('Error fetching jobs:', err)
    error(res, 'Internal server error')
  }
}

// Create new job
export const createJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createJobSchema.parse(req.body)

    const now = Date.now()
    const newJob = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.insertInto('jobs').values(newJob).executeTakeFirst()

    success(
      res,
      {
        id: Number(result.insertId),
        ...newJob
      },
      'Job created successfully'
    )
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

    const updateData = {
      ...validatedData,
      update_time: Date.now()
    }

    const result = await db
      .updateTable('jobs')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Job not found')
      return
    }

    success(res, { id, ...updateData }, 'Job updated successfully')
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

    const result = await db
      .updateTable('jobs')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
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
