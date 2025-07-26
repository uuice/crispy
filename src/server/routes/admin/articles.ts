import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import { articleService } from '../../services/articleService'

// Validation schemas
const createArticleSchema = z.object({
  title: z.string().min(1),
  sub_title: z.string().optional(),
  url: z.string().optional(),
  content: z.string().min(1),
  markdown_content: z.string().optional(),
  is_markdown: z.number().default(0),
  abstract: z.string().optional(),
  image: z.string().optional(),
  image_list: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
  remark: z.string().optional(),
  user_id: z.number().optional(),
  tags: z.string().optional(),
  type_id: z.number().optional(),
  type_ids: z.string().optional(),
  status: z.number().default(10), // 10: draft, 20: published
  sort: z.number().default(0),
  click: z.number().default(0),
  attrs: z.string().optional(),
  redirect_url: z.string().optional(),
  is_review: z.number().default(-10)
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
    const filters = {
      title: req.query['title'] as string | undefined,
      sub_title: req.query['sub_title'] as string | undefined,
      abstract: req.query['abstract'] as string | undefined,
      content: req.query['content'] as string | undefined,
      author_id:
        req.query['author_id'] !== undefined
          ? parseInt(req.query['author_id'] as string)
          : undefined,
      user_id:
        req.query['user_id'] !== undefined ? parseInt(req.query['user_id'] as string) : undefined,
      type_id:
        req.query['type_id'] !== undefined ? parseInt(req.query['type_id'] as string) : undefined,
      type_ids: req.query['type_ids'] as string | undefined,
      status:
        req.query['status'] !== undefined ? parseInt(req.query['status'] as string) : undefined,
      is_review:
        req.query['is_review'] !== undefined
          ? parseInt(req.query['is_review'] as string)
          : undefined,
      tags: req.query['tags'] as string | undefined,
      attrs: req.query['attrs'] as string | undefined,
      url: req.query['url'] as string | undefined,
      redirect_url: req.query['redirect_url'] as string | undefined,
      image: req.query['image'] as string | undefined,
      image_list: req.query['image_list'] as string | undefined,
      seo_title: req.query['seo_title'] as string | undefined,
      seo_description: req.query['seo_description'] as string | undefined,
      seo_keywords: req.query['seo_keywords'] as string | undefined,
      remark: req.query['remark'] as string | undefined,
      click: req.query['click'] !== undefined ? parseInt(req.query['click'] as string) : undefined,
      sort: req.query['sort'] !== undefined ? parseInt(req.query['sort'] as string) : undefined,
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
          : undefined,
      start_time:
        req.query['start_time'] !== undefined
          ? parseInt(req.query['start_time'] as string)
          : undefined,
      end_time:
        req.query['end_time'] !== undefined ? parseInt(req.query['end_time'] as string) : undefined
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
      validationError(res, err.issues)
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
      validationError(res, err.issues)
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
