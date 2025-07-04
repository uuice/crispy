import { db } from '@src/libs/db'
import { sql, ExpressionBuilder } from 'kysely'
import type { DB } from '@src/db/db.d'
import { DELETE_STATUS, PUBLISH_STATUS } from '../config/const'

export interface CreateArticleData {
  title: string
  content: string
  summary?: string
  cover_image?: string
  author?: string
  source?: string
  source_url?: string
  tags?: string // Comma-separated tags
  type_id?: number
  status?: number // 10: draft, 20: published
  sort?: number
  click?: number
  like_count?: number
  comment_count?: number
}

export type UpdateArticleData = Partial<CreateArticleData>

export interface ArticleFilters {
  title?: string
  type_id?: number
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
  dataList: T[]
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
    if (filters.type_id !== undefined && !isNaN(filters.type_id)) {
      query = query.where(sql.ref('type_id'), '=', filters.type_id)
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
      dataList: articles,
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
    // If type_id is provided, verify that the category exists
    if (data.type_id) {
      const category = await this.verifyCategoryExists(data.type_id)
      if (!category) {
        throw new Error('Category not found')
      }
    }

    const now = Date.now()
    const newArticle = {
      ...data,
      type_id: data.type_id,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.safeInsertInto('articles').values(newArticle).executeTakeFirst()

    return {
      id: Number(result.insertId),
      ...newArticle
    }
  }

  /**
   * Update an article
   */
  async updateArticle(id: number, data: UpdateArticleData) {
    // If type_id is being updated, verify that the new category exists
    if (data.type_id !== undefined) {
      const category = await this.verifyCategoryExists(data.type_id)
      if (!category) {
        throw new Error('Category not found')
      }
    }

    const updateData = {
      ...data,
      type_id: data.type_id,
      update_time: Date.now()
    }

    const result = await db
      .safeUpdateTable('articles')
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
      .safeUpdateTable('articles')
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
  async getArticlesByCategory(type_id: number, limit = 10) {
    return await db
      .selectFrom('articles')
      .selectAll()
      .where(sql.ref('type_id'), '=', type_id)
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
      .safeUpdateTable('articles')
      .set((eb: ExpressionBuilder<DB, 'articles'>) => ({
        click: eb(sql.ref('click'), '+', 1),
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
      .safeUpdateTable('articles')
      .set((eb: ExpressionBuilder<DB, 'articles'>) => ({
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
      .safeUpdateTable('articles')
      .set((eb: ExpressionBuilder<DB, 'articles'>) => ({
        comment_count: eb(sql.ref('comment_count'), '+', 1),
        update_time: Date.now()
      }))
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()
  }

  // 统计文章总数
  async countArticles(): Promise<number> {
    const result = await db
      .selectFrom('articles')
      .select((eb) => [eb.fn.count('id').as('count')])
      .where('is_delete', '=', 0)
      .executeTakeFirst()
    return Number(result?.count) || 0
  }

  // 统计所有文章浏览量总和
  async sumArticleViews(): Promise<number> {
    const result = await db
      .selectFrom('articles')
      .select((eb) => [eb.fn.sum(sql.ref('click')).as('views')])
      .where('is_delete', '=', 0)
      .executeTakeFirst()
    return Number(result?.views) || 0
  }

  // 按分类统计文章数
  async countArticlesByCategoryId(typeId: number): Promise<number> {
    const result = await db
      .selectFrom('articles')
      .select((eb) => [eb.fn.count('id').as('count')])
      .where('type_id', '=', typeId)
      .where('is_delete', '=', 0)
      .executeTakeFirst()
    return Number(result?.count) || 0
  }

  // 获取最新文章
  async getRecentArticles(limit: number = 5): Promise<any[]> {
    return await db
      .selectFrom('articles')
      .selectAll()
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }
}

export const articleService = new ArticleService()
