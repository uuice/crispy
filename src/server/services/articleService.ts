import { db } from '@src/libs/db'
import { sql } from 'kysely'

export interface CreateArticleData {
  title: string
  content: string
  summary?: string
  cover_image?: string
  author?: string
  source?: string
  source_url?: string
  tags?: string // Comma-separated tags
  category_id?: number
  status?: number // 10: draft, 20: published
  sort?: number
  view_count?: number
  like_count?: number
  comment_count?: number
}

export type UpdateArticleData = Partial<CreateArticleData>

export interface ArticleFilters {
  title?: string
  category_id?: number
  status?: number
  tag?: string
  start_time?: number
  end_time?: number
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export class ArticleService {
  /**
   * Get a single article by ID
   */
  async getArticleById(id: number) {
    return await db
      .selectFrom('articles')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()
  }

  /**
   * Get articles with pagination and filters
   */
  async getArticles(
    filters: ArticleFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResult<any>> {
    const { page, pageSize } = pagination
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('articles').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (filters.title) {
      query = query.where(sql.ref('title'), 'like', `%${filters.title}%`)
    }
    if (filters.category_id !== undefined && !isNaN(filters.category_id)) {
      query = query.where(sql.ref('category_id'), '=', filters.category_id)
    }
    if (filters.status !== undefined && !isNaN(filters.status)) {
      query = query.where(sql.ref('status'), '=', filters.status)
    }
    if (filters.tag) {
      query = query.where(sql.ref('tags'), 'like', `%${filters.tag}%`)
    }
    if (filters.start_time) {
      query = query.where(sql.ref('create_time'), '>=', filters.start_time)
    }
    if (filters.end_time) {
      query = query.where(sql.ref('create_time'), '<=', filters.end_time)
    }

    // Order by create_time desc by default
    query = query.orderBy('create_time', 'desc')

    const [articles, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    return {
      data: articles,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Verify that a category exists
   */
  async verifyCategoryExists(categoryId: number) {
    return await db
      .selectFrom('categories')
      .select('id')
      .where('id', '=', categoryId)
      .where('is_delete', '=', 0)
      .executeTakeFirst()
  }

  /**
   * Create a new article
   */
  async createArticle(data: CreateArticleData) {
    // If category_id is provided, verify that the category exists
    if (data.category_id) {
      const category = await this.verifyCategoryExists(data.category_id)
      if (!category) {
        throw new Error('Category not found')
      }
    }

    const now = Date.now()
    const newArticle = {
      ...data,
      type_id: data.category_id,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.insertInto('articles').values(newArticle).executeTakeFirst()

    return {
      id: Number(result.insertId),
      ...newArticle
    }
  }

  /**
   * Update an article
   */
  async updateArticle(id: number, data: UpdateArticleData) {
    // If category_id is being updated, verify that the new category exists
    if (data.category_id !== undefined) {
      const category = await this.verifyCategoryExists(data.category_id)
      if (!category) {
        throw new Error('Category not found')
      }
    }

    const updateData = {
      ...data,
      type_id: data.category_id,
      update_time: Date.now()
    }

    const result = await db
      .updateTable('articles')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return {
      success: result.numUpdatedRows > 0,
      numUpdatedRows: result.numUpdatedRows
    }
  }

  /**
   * Delete an article (logical delete)
   */
  async deleteArticle(id: number) {
    const result = await db
      .updateTable('articles')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return {
      success: result.numUpdatedRows > 0,
      numUpdatedRows: result.numUpdatedRows
    }
  }

  /**
   * Get articles by category ID
   */
  async getArticlesByCategory(categoryId: number, limit = 10) {
    return await db
      .selectFrom('articles')
      .selectAll()
      .where(sql.ref('category_id'), '=', categoryId)
      .where('is_delete', '=', 0)
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get articles by status
   */
  async getArticlesByStatus(status: number, limit = 10) {
    return await db
      .selectFrom('articles')
      .selectAll()
      .where('status', '=', status)
      .where('is_delete', '=', 0)
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get articles by tag
   */
  async getArticlesByTag(tag: string, limit = 10) {
    return await db
      .selectFrom('articles')
      .selectAll()
      .where('tags', 'like', `%${tag}%`)
      .where('is_delete', '=', 0)
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Increment view count for an article
   */
  async incrementViewCount(id: number) {
    return await db
      .updateTable('articles')
      .set((eb) => ({
        view_count: eb(sql.ref('view_count'), '+', 1),
        update_time: Date.now()
      }))
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()
  }

  /**
   * Increment like count for an article
   */
  async incrementLikeCount(id: number) {
    return await db
      .updateTable('articles')
      .set((eb) => ({
        like_count: eb(sql.ref('like_count'), '+', 1),
        update_time: Date.now()
      }))
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()
  }

  /**
   * Increment comment count for an article
   */
  async incrementCommentCount(id: number) {
    return await db
      .updateTable('articles')
      .set((eb) => ({
        comment_count: eb(sql.ref('comment_count'), '+', 1),
        update_time: Date.now()
      }))
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()
  }
}

export const articleService = new ArticleService()
