import { NextFunction, Request, Response } from 'express'
import { error, notFound, success } from '../../utils/response'
import { linkService } from '../../services/linkService'

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

    const filters = {
      site_name: req.query['site_name'] as string | undefined,
      des: req.query['des'] as string | undefined,
      logo: req.query['logo'] as string | undefined,
      method: req.query['method'] as string | undefined,
      type_id:
        req.query['type_id'] !== undefined ? parseInt(req.query['type_id'] as string) : undefined,
      sort: req.query['sort'] !== undefined ? parseInt(req.query['sort'] as string) : undefined,
      status:
        req.query['status'] !== undefined ? parseInt(req.query['status'] as string) : undefined,
      url: req.query['url'] as string | undefined,
      is_delete:
        req.query['is_delete'] !== undefined
          ? parseInt(req.query['is_delete'] as string)
          : undefined,
      update_time:
        req.query['update_time'] !== undefined
          ? parseInt(req.query['update_time'] as string)
          : undefined,
      start_time:
        req.query['start_time'] !== undefined
          ? parseInt(req.query['start_time'] as string)
          : undefined,
      end_time:
        req.query['end_time'] !== undefined ? parseInt(req.query['end_time'] as string) : undefined
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
