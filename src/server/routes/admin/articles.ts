import { db } from '@src/libs/db'
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import { sql } from 'kysely'

// Validation schemas
const createArticleSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  summary: z.string().optional(),
  cover_image: z.string().optional(),
  author: z.string().optional(),
  source: z.string().optional(),
  source_url: z.string().optional(),
  tags: z.string().optional(), // Comma-separated tags
  category_id: z.number().optional(),
  status: z.number().default(10), // 10: draft, 20: published
  sort: z.number().default(0),
  view_count: z.number().default(0),
  like_count: z.number().default(0),
  comment_count: z.number().default(0)
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

    const article = await db
      .selectFrom('articles')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

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
    const offset = (page - 1) * pageSize

    // Get filters from query
    const title = req.query['title'] as string | undefined
    const categoryId = req.query['category_id']
      ? parseInt(req.query['category_id'] as string)
      : undefined
    const status = req.query['status'] ? parseInt(req.query['status'] as string) : undefined
    const tag = req.query['tag'] as string | undefined
    const startTime = req.query['start_time']
      ? parseInt(req.query['start_time'] as string)
      : undefined
    const endTime = req.query['end_time'] ? parseInt(req.query['end_time'] as string) : undefined

    let query = db.selectFrom('articles').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (title) {
      query = query.where(sql.ref('title'), 'like', `%${title}%`)
    }
    if (categoryId !== undefined && !isNaN(categoryId)) {
      query = query.where(sql.ref('category_id'), '=', categoryId)
    }
    if (status !== undefined && !isNaN(status)) {
      query = query.where(sql.ref('status'), '=', status)
    }
    if (tag) {
      query = query.where(sql.ref('tags'), 'like', `%${tag}%`)
    }
    if (startTime) {
      query = query.where(sql.ref('create_time'), '>=', startTime)
    }
    if (endTime) {
      query = query.where(sql.ref('create_time'), '<=', endTime)
    }

    // Order by create_time desc by default
    query = query.orderBy('create_time', 'desc')

    const [articles, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    success(res, {
      data: articles,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    })
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

    // If category_id is provided, verify that the category exists
    if (validatedData.category_id) {
      const category = await db
        .selectFrom('categories')
        .select('id')
        .where('id', '=', validatedData.category_id)
        .where('is_delete', '=', 0)
        .executeTakeFirst()

      if (!category) {
        error(res, 'Category not found', 400)
        return
      }
    }

    const now = Date.now()
    const newArticle = {
      ...validatedData,
      type_id: validatedData.category_id,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.insertInto('articles').values(newArticle).executeTakeFirst()

    success(
      res,
      {
        id: Number(result.insertId),
        ...newArticle
      },
      'Article created successfully'
    )
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
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

    // If category_id is being updated, verify that the new category exists
    if (validatedData.category_id !== undefined) {
      const category = await db
        .selectFrom('categories')
        .select('id')
        .where('id', '=', validatedData.category_id)
        .where('is_delete', '=', 0)
        .executeTakeFirst()

      if (!category) {
        error(res, 'Category not found', 400)
        return
      }
    }

    const updateData = {
      ...validatedData,
      type_id: validatedData.category_id,
      update_time: Date.now()
    }

    const result = await db
      .updateTable('articles')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Article not found')
      return
    }

    success(res, { id, ...updateData }, 'Article updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
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

    const result = await db
      .updateTable('articles')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
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
