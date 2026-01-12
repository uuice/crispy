import { NextFunction, Request, Response } from 'express'
import { additionService } from '../../services/additionService'
import { error, notFound, success } from '../../utils/response'

// Get single addition
export const getAddition = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const addition = await additionService.getAdditionById(id)
    success(res, addition)
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Addition not found') {
      notFound(res, 'Addition not found')
      return
    }
    console.error('Error fetching addition:', err)
    error(res, 'Internal server error')
  }
}

// Get additions list with pagination
export const getAdditions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10

    const filters = {
      fields_json: req.query['fields_json'] as string | undefined,
      primary_id:
        req.query['primary_id'] !== undefined
          ? parseInt(req.query['primary_id'] as string)
          : undefined,
      status:
        req.query['status'] !== undefined ? parseInt(req.query['status'] as string) : undefined,
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
          : undefined
    }
    const result = await additionService.getAdditions({ page, pageSize }, filters)
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching additions:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const additionController = {
  getAddition,
  getAdditions
}
