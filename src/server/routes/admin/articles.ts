import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import { articleService } from '../../services/articleService'

// Validation schemas
const createArticleSchema = z.object({
  title: z.string().min(1),
  url: z.string().optional(),
  content: z.string().min(1),
  summary: z.string().optional(),
  cover_image: z.string().optional(),
  author: z.string().optional(),
  source: z.string().optional(),
  source_url: z.string().optional(),
  tags: z.string().optional(), // Comma-separated tags
  type_id: z.number().optional(),
  status: z.number().default(10), // 10: draft, 20: published
  sort: z.number().default(0),
  click: z.number().default(0)
  // like_count: z.number().default(0),
  // comment_count: z.number().default(0)
})

const updateArticleSchema = createArticleSchema.partial()

// Get single article
export const getArticle = async (
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

    const article = await articleService.getArticleById(id)

    if (!article) {
      notFound(res, 'Article not found')
      return
    }

    success(res, article)
  } catch (err: unknown) {
    console.error('Error fetching article:', err)
    error(res, 'Internal server error')
  }
}

// Get articles list with pagination
export const getArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10

    // Get filters from query
    const filters = {
      title: req.query['title'] as string | undefined,
      type_id: req.query['type_id'] ? parseInt(req.query['type_id'] as string) : undefined,
      status: req.query['status'] ? parseInt(req.query['status'] as string) : undefined,
      tag: req.query['tag'] as string | undefined,
      start_time: req.query['start_time'] ? parseInt(req.query['start_time'] as string) : undefined,
      end_time: req.query['end_time'] ? parseInt(req.query['end_time'] as string) : undefined
    }

    const result = await articleService.getArticles(filters, { page, pageSize })

    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching articles:', err)
    error(res, 'Internal server error')
  }
}

// Create new article
export const createArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createArticleSchema.parse(req.body)

    const result = await articleService.createArticle(validatedData)

    success(res, result, 'Article created successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    if (err instanceof Error && err.message === 'Category not found') {
      error(res, 'Category not found', 400)
      return
    }
    console.error('Error creating article:', err)
    error(res, 'Internal server error')
  }
}

// Update article
export const updateArticle = async (
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

    const validatedData = updateArticleSchema.parse(req.body)

    const result = await articleService.updateArticle(id, validatedData)

    if (!result.success) {
      notFound(res, 'Article not found')
      return
    }

    success(res, { id, ...validatedData }, 'Article updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    if (err instanceof Error && err.message === 'Category not found') {
      error(res, 'Category not found', 400)
      return
    }
    console.error('Error updating article:', err)
    error(res, 'Internal server error')
  }
}

// Delete article (logical delete)
export const deleteArticle = async (
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

    const result = await articleService.deleteArticle(id)

    if (!result.success) {
      notFound(res, 'Article not found')
      return
    }

    success(res, null, 'Article deleted successfully')
  } catch (err: unknown) {
    console.error('Error deleting article:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const articleController = {
  getArticle,
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle
}
