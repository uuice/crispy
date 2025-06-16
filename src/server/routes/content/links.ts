import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import {
  linkService,
  CreateLinkData,
  UpdateLinkData,
  LinkFilters
} from '../../services/linkService'

// Get single link
export const getLink = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const link = await linkService.getLinkById(id)

    if (!link) {
      notFound(res, 'Link not found')
      return
    }

    success(res, link)
  } catch (err: unknown) {
    console.error('Error fetching link:', err)
    error(res, 'Internal server error')
  }
}

// Get links list with pagination
export const getLinks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10

    // Build filters from query
    const filters: LinkFilters = {}
    if (req.query['site_name']) {
      filters.siteName = req.query['site_name'] as string
    }
    if (req.query['url']) {
      filters.url = req.query['url'] as string
    }
    if (req.query['status']) {
      filters.status = parseInt(req.query['status'] as string)
    }
    if (req.query['type_id']) {
      filters.typeId = parseInt(req.query['type_id'] as string)
    }
    if (req.query['start_time']) {
      filters.startTime = parseInt(req.query['start_time'] as string)
    }
    if (req.query['end_time']) {
      filters.endTime = parseInt(req.query['end_time'] as string)
    }

    const result = await linkService.getLinks({ page, pageSize }, filters)
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching links:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const linkController = {
  getLink,
  getLinks
}
