import { NextFunction, Request, Response } from 'express'
import { error, notFound, success } from '../../utils/response'
import { keywordService } from '../../services/keywordService'

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
      count: req.query['count'] !== undefined ? parseInt(req.query['count'] as string) : undefined,
      status:
        req.query['status'] !== undefined ? parseInt(req.query['status'] as string) : undefined,
      type_id:
        req.query['type_id'] !== undefined ? parseInt(req.query['type_id'] as string) : undefined,
      url: req.query['url'] as string | undefined,
      value: req.query['value'] as string | undefined,
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
    const result = await keywordService.getKeywords({ page, pageSize }, filters)
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching keywords:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const keywordController = {
  getKeyword,
  getKeywords
}
