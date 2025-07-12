import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import {
  keywordService,
  CreateKeywordData,
  UpdateKeywordData,
  KeywordFilters
} from '../../services/keywordService'

// Validation schemas
const createKeywordSchema = z.object({
  title: z.string().min(1),
  alias: z.string().min(1),
  value: z.string().optional(),
  url: z.string().optional(),
  type_id: z.number().optional(),
  status: z.number().default(10)
})

const updateKeywordSchema = createKeywordSchema.partial()

// Get single keyword
export const getKeyword = async (
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

    const keyword = await keywordService.getKeywordById(id)

    if (!keyword) {
      notFound(res, 'Keyword not found')
      return
    }

    success(res, keyword)
  } catch (err: unknown) {
    console.error('Error fetching keyword:', err)
    error(res, 'Internal server error')
  }
}

// Get keywords list with pagination
export const getKeywords = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10


    const filters = {
      title: req.query['title'] as string | undefined,
      alias: req.query['alias'] as string | undefined,
      count: req.query['count'] ? parseInt(req.query['count'] as string) : undefined,
      status: req.query['status'] ? parseInt(req.query['status'] as string) : undefined,
      type_id: req.query['type_id'] ? parseInt(req.query['type_id'] as string) : undefined,
      url: req.query['url'] as string | undefined,
      value: req.query['value'] as string | undefined,
      is_delete: req.query['is_delete'] ? parseInt(req.query['is_delete'] as string) : undefined,
      update_time: req.query['update_time']
        ? parseInt(req.query['update_time'] as string)
        : undefined,
      create_time: req.query['create_time']
        ? parseInt(req.query['create_time'] as string)
        : undefined
    }

    const result = await keywordService.getKeywords({ page, pageSize }, filters)
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching keywords:', err)
    error(res, 'Internal server error')
  }
}

// Create new keyword
export const createKeyword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createKeywordSchema.parse(req.body) as CreateKeywordData

    const newKeyword = await keywordService.createKeyword(validatedData)
    success(res, newKeyword, 'Keyword created successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error creating keyword:', err)
    error(res, 'Internal server error')
  }
}

// Update keyword
export const updateKeyword = async (
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

    const validatedData = updateKeywordSchema.parse(req.body) as UpdateKeywordData

    const updated = await keywordService.updateKeyword(id, validatedData)

    if (!updated) {
      notFound(res, 'Keyword not found')
      return
    }

    success(res, { id, ...validatedData }, 'Keyword updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error updating keyword:', err)
    error(res, 'Internal server error')
  }
}

// Delete keyword (logical delete)
export const deleteKeyword = async (
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

    const deleted = await keywordService.deleteKeyword(id)

    if (!deleted) {
      notFound(res, 'Keyword not found')
      return
    }

    success(res, null, 'Keyword deleted successfully')
  } catch (err: unknown) {
    console.error('Error deleting keyword:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const keywordController = {
  getKeyword,
  getKeywords,
  createKeyword,
  updateKeyword,
  deleteKeyword
}
