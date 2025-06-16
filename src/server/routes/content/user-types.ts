import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { userTypeService } from '../../services/userTypeService'
import { success, error, validationError, notFound } from '../../utils/response'

// Get single user type
export const getUserType = async (
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

    const userType = await userTypeService.getUserTypeById(id)
    success(res, userType)
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'User type not found') {
      notFound(res, 'User type not found')
      return
    }
    console.error('Error fetching user type:', err)
    error(res, 'Internal server error')
  }
}

// Get user types list with pagination
export const getUserTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10

    // Get filters from query
    const filters = {
      type_name: req.query['type_name'] as string | undefined,
      alias: req.query['alias'] as string | undefined,
      status: req.query['status'] ? parseInt(req.query['status'] as string) : undefined,
      start_time: req.query['start_time'] ? parseInt(req.query['start_time'] as string) : undefined,
      end_time: req.query['end_time'] ? parseInt(req.query['end_time'] as string) : undefined
    }

    const result = await userTypeService.getUserTypes({ page, pageSize }, filters)
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching user types:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const userTypeController = {
  getUserType,
  getUserTypes
}
