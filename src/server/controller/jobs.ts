import { NextFunction, Request, Response } from 'express'
import { error, handleError, success } from '../utils/response'
import { jobService } from '../services/jobService'
import { JobFilters } from '@src/types'

// Get single job
export const getJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const job = await jobService.getById(id)

    if (!job) {
      error(res, '职位不存在', 404)
      return
    }

    success(res, job)
  } catch (err: unknown) {
    handleError(res, err, 'getJob')
  }
}

// Get jobs list with pagination
export const getJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await jobService.getJobs(req.query as unknown as JobFilters)
    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getJobs')
  }
}

// Create new job
export const createJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await jobService.create(req.body)

    success(res, result, '职位创建成功')
  } catch (err: unknown) {
    handleError(res, err, 'createJob')
  }
}

// Update job
export const updateJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const result = await jobService.update(id, req.body)
    success(res, result, '职位更新成功')
  } catch (err: unknown) {
    handleError(res, err, 'updateJob')
  }
}

// Delete job (logical delete)
export const deleteJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const deleted = await jobService.delete(id)
    if (!deleted) {
      error(res, '职位不存在', 404)
      return
    }

    success(res, null, '职位删除成功')
  } catch (err: unknown) {
    handleError(res, err, 'deleteJob')
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
