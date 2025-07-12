import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import {
  linkService,
  CreateLinkData,
  UpdateLinkData,
  LinkFilters
} from '../../services/linkService'

// Validation schemas
const createLinkSchema = z.object({
  site_name: z.string().min(1, '站点名称不能为空'),
  des: z.string().min(1, '描述不能为空'),
  url: z.string().url('请输入有效的URL地址'),
  logo: z.string().optional(),
  method: z.string().optional(),
  type_id: z.number().default(0),
  sort: z.number().default(0),
  status: z.number().default(10)
})

const updateLinkSchema = createLinkSchema.partial()

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
      type_id: req.query['type_id'] ? parseInt(req.query['type_id'] as string) : undefined,
      sort: req.query['sort'] ? parseInt(req.query['sort'] as string) : undefined,
      status: req.query['status'] ? parseInt(req.query['status'] as string) : undefined,
      url: req.query['url'] as string | undefined,
      is_delete: req.query['is_delete'] ? parseInt(req.query['is_delete'] as string) : undefined,
      update_time: req.query['update_time']
        ? parseInt(req.query['update_time'] as string)
        : undefined,
      start_time: req.query['start_time'] ? parseInt(req.query['start_time'] as string) : undefined,
      end_time: req.query['end_time'] ? parseInt(req.query['end_time'] as string) : undefined
    }
    const result = await linkService.getLinks({ page, pageSize }, filters)
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching links:', err)
    error(res, 'Internal server error')
  }
}

// Create new link
export const createLink = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createLinkSchema.parse(req.body) as CreateLinkData

    const newLink = await linkService.createLink(validatedData)
    success(res, newLink, 'Link created successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error creating link:', err)
    error(res, 'Internal server error')
  }
}

// Update link
export const updateLink = async (
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

    const validatedData = updateLinkSchema.parse(req.body) as UpdateLinkData

    const updated = await linkService.updateLink(id, validatedData)

    if (!updated) {
      notFound(res, 'Link not found')
      return
    }

    success(res, { id, ...validatedData }, 'Link updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error updating link:', err)
    error(res, 'Internal server error')
  }
}

// Delete link (logical delete)
export const deleteLink = async (
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

    const deleted = await linkService.deleteLink(id)

    if (!deleted) {
      notFound(res, 'Link not found')
      return
    }

    success(res, null, 'Link deleted successfully')
  } catch (err: unknown) {
    console.error('Error deleting link:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const linkController = {
  getLink,
  getLinks,
  createLink,
  updateLink,
  deleteLink
}
