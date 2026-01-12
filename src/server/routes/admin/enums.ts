import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import { enumService } from '../../services/enumService'

// Validation schemas
const createEnumSchema = z.object({
  title: z.string().min(1),
  alias: z.string().optional(),
  code: z.string().min(1),
  value: z.string().min(1),
  sort: z.number().default(0),
  status: z.number().default(10)
})

const updateEnumSchema = createEnumSchema.partial()

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

// Create new enum
export const createEnum = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createEnumSchema.parse(req.body)

    const result = await enumService.createEnum(validatedData)

    success(res, result, 'Enum created successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.issues)
      return
    }
    console.error('Error creating enum:', err)
    error(res, 'Internal server error')
  }
}

// Update enum
export const updateEnum = async (
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

    const validatedData = updateEnumSchema.parse(req.body)

    const result = await enumService.updateEnum(id, validatedData)

    if (!result.success) {
      notFound(res, 'Enum not found')
      return
    }

    success(res, { id, ...validatedData }, 'Enum updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.issues)
      return
    }
    console.error('Error updating enum:', err)
    error(res, 'Internal server error')
  }
}

// Delete enum (logical delete)
export const deleteEnum = async (
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

    const result = await enumService.deleteEnum(id)

    if (!result.success) {
      notFound(res, 'Enum not found')
      return
    }

    success(res, null, 'Enum deleted successfully')
  } catch (err: unknown) {
    console.error('Error deleting enum:', err)
    error(res, 'Internal server error')
  }
}

import { Elysia } from 'elysia'
const enumRouter = new Elysia({
  prefix: '/enums'
})
  .get('/', getEnums)
  .get('/:id', getEnum)
  .post('/', createEnum)
  .put('/:id', updateEnum)
  .delete('/:id', deleteEnum)
export default enumRouter
