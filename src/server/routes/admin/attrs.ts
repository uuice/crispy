import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import { attrService } from '../../services/attrService'

// Validation schemas
const createAttrSchema = z.object({
  title: z.string().min(1),
  alias: z.string().optional(),
  sort: z.number().default(0),
  status: z.number().default(10)
})

const updateAttrSchema = createAttrSchema.partial()

// Get single attr
export const getAttr = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const attr = await attrService.getAttrById(id)

    if (!attr) {
      notFound(res, 'Attribute not found')
      return
    }

    success(res, attr)
  } catch (err: unknown) {
    console.error('Error fetching attribute:', err)
    error(res, 'Internal server error')
  }
}

// Get attrs list with pagination
export const getAttrs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10
    const filters = {
      title: req.query['title'] as string | undefined,
      alias: req.query['alias'] as string | undefined,
      sort: req.query['sort'] ? parseInt(req.query['sort'] as string) : undefined,
      status: req.query['status'] ? parseInt(req.query['status'] as string) : undefined,
      is_delete: req.query['is_delete'] ? parseInt(req.query['is_delete'] as string) : undefined,
      update_time: req.query['update_time']
        ? parseInt(req.query['update_time'] as string)
        : undefined,
      create_time: req.query['create_time']
        ? parseInt(req.query['create_time'] as string)
        : undefined
    }
    const result = await attrService.getAttrs(filters, { page, pageSize })
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching attributes:', err)
    error(res, 'Internal server error')
  }
}

// Create new attr
export const createAttr = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createAttrSchema.parse(req.body)

    const result = await attrService.createAttr(validatedData)

    success(res, result, 'Attribute created successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error creating attribute:', err)
    error(res, 'Internal server error')
  }
}

// Update attr
export const updateAttr = async (
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

    const validatedData = updateAttrSchema.parse(req.body)

    const result = await attrService.updateAttr(id, validatedData)

    if (!result.success) {
      notFound(res, 'Attribute not found')
      return
    }

    success(res, { id, ...validatedData }, 'Attribute updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error updating attribute:', err)
    error(res, 'Internal server error')
  }
}

// Delete attr (logical delete)
export const deleteAttr = async (
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

    const result = await attrService.deleteAttr(id)

    if (!result.success) {
      notFound(res, 'Attribute not found')
      return
    }

    success(res, null, 'Attribute deleted successfully')
  } catch (err: unknown) {
    console.error('Error deleting attribute:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const attrController = {
  getAttr,
  getAttrs,
  createAttr,
  updateAttr,
  deleteAttr
}
