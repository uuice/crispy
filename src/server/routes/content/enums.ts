import { NextFunction, Request, Response } from 'express'
import { error, notFound, success } from '../../utils/response'
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

    const filters = {
      title: req.query['title'] as string | undefined,
      alias: req.query['alias'] as string | undefined,
      code: req.query['code'] as string | undefined,
      value: req.query['value'] as string | undefined,
      sort: req.query['sort'] !== undefined ? parseInt(req.query['sort'] as string) : undefined,
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
