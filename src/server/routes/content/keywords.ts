import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import {
  keywordService,
  CreateKeywordData,
  UpdateKeywordData,
  KeywordFilters
} from '../../services/keywordService'

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

    // Build filters from query
    const filters: KeywordFilters = {}
    if (req.query['title']) {
      filters.title = req.query['title'] as string
    }
    if (req.query['alias']) {
      filters.alias = req.query['alias'] as string
    }
    if (req.query['status']) {
      filters.status = parseInt(req.query['status'] as string)
    }
    if (req.query['start_time']) {
      filters.startTime = parseInt(req.query['start_time'] as string)
    }
    if (req.query['end_time']) {
      filters.endTime = parseInt(req.query['end_time'] as string)
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
