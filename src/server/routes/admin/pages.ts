import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import {
  pageService,
  CreatePageData,
  UpdatePageData,
  PageFilters
} from '../../services/pageService'

// Validation schemas
const createPageSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  url: z.string().optional(),
  alias: z.string().min(1, '别名不能为空'),
  content: z.string().min(1, '内容不能为空'),
  markdown_content: z.string().optional(),
  is_markdown: z.number().default(0),
  abstract: z
    .string()
    .optional()
    .transform((val) => val || ''),
  sub_title: z
    .string()
    .optional()
    .transform((val) => val || ''),
  seo_title: z
    .string()
    .optional()
    .transform((val) => val || ''),
  seo_description: z
    .string()
    .optional()
    .transform((val) => val || ''),
  seo_keywords: z
    .string()
    .optional()
    .transform((val) => val || ''),
  image_list: z
    .string()
    .optional()
    .transform((val) => val || ''),
  tags: z
    .string()
    .optional()
    .transform((val) => val || ''),
  remark: z
    .string()
    .optional()
    .transform((val) => val || ''),
  type_id: z
    .number()
    .optional()
    .transform((val) => val || 0),
  author_id: z
    .number()
    .optional()
    .transform((val) => val || 0),
  user_id: z
    .number()
    .optional()
    .transform((val) => val || 0),
  status: z.number().default(10)
})

const updatePageSchema = createPageSchema.partial()

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

    const filters = {
      title: req.query['title'] as string | undefined,
      alias: req.query['alias'] as string | undefined,
      status:
        req.query['status'] !== undefined ? parseInt(req.query['status'] as string) : undefined,
      type_id:
        req.query['type_id'] !== undefined ? parseInt(req.query['type_id'] as string) : undefined,
      author_id:
        req.query['author_id'] !== undefined
          ? parseInt(req.query['author_id'] as string)
          : undefined,
      user_id:
        req.query['user_id'] !== undefined ? parseInt(req.query['user_id'] as string) : undefined,
      url: req.query['url'] as string | undefined,
      remark: req.query['remark'] as string | undefined,
      tags: req.query['tags'] as string | undefined,
      seo_title: req.query['seo_title'] as string | undefined,
      seo_description: req.query['seo_description'] as string | undefined,
      seo_keywords: req.query['seo_keywords'] as string | undefined,
      sub_title: req.query['sub_title'] as string | undefined,
      abstract: req.query['abstract'] as string | undefined,
      image_list: req.query['image_list'] as string | undefined,
      is_delete:
        req.query['is_delete'] !== undefined
          ? parseInt(req.query['is_delete'] as string)
          : undefined,
      update_time: req.query['update_time']
        ? parseInt(req.query['update_time'] as string)
        : undefined,
      create_time: req.query['create_time']
        ? parseInt(req.query['create_time'] as string)
        : undefined,
      start_time:
        req.query['start_time'] !== undefined
          ? parseInt(req.query['start_time'] as string)
          : undefined,
      end_time:
        req.query['end_time'] !== undefined ? parseInt(req.query['end_time'] as string) : undefined
    }
    const result = await pageService.getPages({ page, pageSize }, filters)
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching pages:', err)
    error(res, 'Internal server error')
  }
}

// Create new page
export const createPage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createPageSchema.parse(req.body) as CreatePageData

    const newPage = await pageService.createPage(validatedData)
    success(res, newPage, 'Page created successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error creating page:', err)
    error(res, 'Internal server error')
  }
}

// Update page
export const updatePage = async (
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

    const validatedData = updatePageSchema.parse(req.body) as UpdatePageData

    const updated = await pageService.updatePage(id, validatedData)

    if (!updated) {
      notFound(res, 'Page not found')
      return
    }

    success(res, { id, ...validatedData }, 'Page updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error updating page:', err)
    error(res, 'Internal server error')
  }
}

// Delete page (logical delete)
export const deletePage = async (
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

    const deleted = await pageService.deletePage(id)

    if (!deleted) {
      notFound(res, 'Page not found')
      return
    }

    success(res, null, 'Page deleted successfully')
  } catch (err: unknown) {
    console.error('Error deleting page:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const pageController = {
  getPage,
  getPages,
  createPage,
  updatePage,
  deletePage
}
