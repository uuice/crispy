import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import {
  pageService,
  CreatePageData,
  UpdatePageData,
  PageFilters
} from '../../services/pageService'

// Get single page
export const getPage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const page = await pageService.getPageById(id)

    if (!page) {
      notFound(res, 'Page not found')
      return
    }

    success(res, page)
  } catch (err: unknown) {
    console.error('Error fetching page:', err)
    error(res, 'Internal server error')
  }
}

// Get pages list with pagination
export const getPages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10

    // Build filters from query
    const filters: PageFilters = {}
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

    const result = await pageService.getPages({ page, pageSize }, filters)
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching pages:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const pageController = {
  getPage,
  getPages
}
