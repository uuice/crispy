import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import { enumService } from '../../services/enumService'

// Get single enum
export const getEnum = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const enumItem = await enumService.getEnumById(id)

    if (!enumItem) {
      notFound(res, 'Enum not found')
      return
    }

    success(res, enumItem)
  } catch (err: unknown) {
    console.error('Error fetching enum:', err)
    error(res, 'Internal server error')
  }
}

// Get enums list with pagination
export const getEnums = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10

    // Get filters from query
    const filters = {
      title: req.query['title'] as string | undefined,
      alias: req.query['alias'] as string | undefined,
      code: req.query['code'] as string | undefined,
      status: req.query['status'] ? parseInt(req.query['status'] as string) : undefined,
      start_time: req.query['start_time'] ? parseInt(req.query['start_time'] as string) : undefined,
      end_time: req.query['end_time'] ? parseInt(req.query['end_time'] as string) : undefined
    }

    const result = await enumService.getEnums(filters, { page, pageSize })

    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching enums:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const enumController = {
  getEnum,
  getEnums
}
