import { db } from '@src/libs/db'
import { sql } from 'kysely'
import type { DB } from '@src/db/db.d'

export interface Comment {
  id: number
  title: string
  content: string
  user_id: number
  parent_id?: number
  status: number
  good_article: number
  bad_article: number
  not_article: number
  create_time: number
  update_time: number
  is_delete: number
  // Joined fields
  author_name?: string
  author_email?: string
  author_avatar?: string
  parent_content?: string
}

export interface CommentFilters {
  content?: string
  title?: string
  user_id?: number
  parent_id?: number
  status?: number
  good_article_min?: number
  good_article_max?: number
  bad_article_min?: number
  bad_article_max?: number
  not_article_min?: number
  not_article_max?: number
  start_time?: number
  end_time?: number
  has_parent?: boolean
}

export interface CreateCommentData {
  title: string
  content: string
  user_id: number
  parent_id?: number
  status?: number
  good_article?: number
  bad_article?: number
  not_article?: number
}

export interface UpdateCommentData {
  title?: string
  content?: string
  status?: number
  good_article?: number
  bad_article?: number
  not_article?: number
}

export interface PaginatedCommentsResult {
  dataList: Comment[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export class CommentService {
  // Get comments with pagination and filters
  async getComments(
    pagination: { page: number; pageSize: number },
    filters: CommentFilters
  ): Promise<PaginatedCommentsResult> {
    const { page, pageSize } = pagination
    const offset = (page - 1) * pageSize

    let query = db
      .selectFrom('comments as c')
      .leftJoin('users as u', 'c.user_id', 'u.id')
      .leftJoin('comments as pc', 'c.parent_id', 'pc.id')
      .selectAll('c')
      .select([
        'u.nick_name as author_name',
        'u.email as author_email',
        'u.avatar_url as author_avatar',
        'pc.content as parent_content'
      ])
      .where('c.is_delete', '=', 0)

    // Apply filters
    if (filters.content) {
      query = query.where('c.content', 'like', `%${filters.content}%`)
    }
    if (filters.title) {
      query = query.where('c.title', 'like', `%${filters.title}%`)
    }
    if (filters.user_id !== undefined) {
      query = query.where('c.user_id', '=', filters.user_id)
    }
    if (filters.parent_id !== undefined) {
      if (filters.parent_id === null) {
        query = query.where('c.parent_id', 'is', null)
      } else {
        query = query.where('c.parent_id', '=', filters.parent_id)
      }
    }
    if (filters.status !== undefined) {
      query = query.where('c.status', '=', filters.status)
    }
    if (filters.start_time !== undefined) {
      query = query.where('c.create_time', '>=', filters.start_time)
    }
    if (filters.end_time !== undefined) {
      query = query.where('c.create_time', '<=', filters.end_time)
    }
    if (filters.good_article_min !== undefined && !isNaN(filters.good_article_min)) {
      query = query.where('c.good_article', '>=', filters.good_article_min)
    }
    if (filters.good_article_max !== undefined && !isNaN(filters.good_article_max)) {
      query = query.where('c.good_article', '<=', filters.good_article_max)
    }
    if (filters.bad_article_min !== undefined && !isNaN(filters.bad_article_min)) {
      query = query.where('c.bad_article', '>=', filters.bad_article_min)
    }
    if (filters.bad_article_max !== undefined && !isNaN(filters.bad_article_max)) {
      query = query.where('c.bad_article', '<=', filters.bad_article_max)
    }
    if (filters.not_article_min !== undefined && !isNaN(filters.not_article_min)) {
      query = query.where('c.not_article', '>=', filters.not_article_min)
    }
    if (filters.not_article_max !== undefined && !isNaN(filters.not_article_max)) {
      query = query.where('c.not_article', '<=', filters.not_article_max)
    }
    if (filters.has_parent === true) {
      query = query.where('c.parent_id', 'is not', null)
    }
    if (filters.has_parent === false) {
      query = query.where('c.parent_id', 'is', null)
    }

    // Get total count
    const countResult = await db
      .selectFrom('comments as c')
      .select((eb: any) => [eb.fn.count('c.id').as('count')])
      .where('c.is_delete', '=', 0)
      .executeTakeFirst()
    const total = Number(countResult?.['count']) || 0

    // Get paginated data
    const dataList = await query
      .orderBy('c.create_time', 'desc')
      .limit(pageSize)
      .offset(offset)
      .execute()

    return {
      dataList: dataList as Comment[],
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    }
  }

  // Get single comment by ID
  async getCommentById(id: number): Promise<Comment | null> {
    const result = await db
      .selectFrom('comments as c')
      .leftJoin('users as u', 'c.user_id', 'u.id')
      .leftJoin('comments as pc', 'c.parent_id', 'pc.id')
      .selectAll('c')
      .select([
        'u.nick_name as author_name',
        'u.email as author_email',
        'u.avatar_url as author_avatar',
        'pc.content as parent_content'
      ])
      .where('c.id', '=', id)
      .where('c.is_delete', '=', 0)
      .executeTakeFirst()

    return result as Comment | null
  }

  // Create new comment
  async createComment(data: CreateCommentData): Promise<Comment> {
    const now = Date.now()
    const newComment = {
      title: data.title,
      content: data.content,
      user_id: data.user_id,
      parent_id: data.parent_id,
      status: data.status || 10, // Default to published
      good_article: data.good_article || 0,
      bad_article: data.bad_article || 0,
      not_article: data.not_article || 0,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.safeInsertInto('comments').values(newComment).executeTakeFirst()

    return {
      id: Number(result.insertId),
      ...newComment
    }
  }

  // Update comment
  async updateComment(
    id: number,
    data: UpdateCommentData
  ): Promise<{ success: boolean; numUpdatedRows: number }> {
    const updateData = {
      ...data,
      update_time: Date.now()
    }

    const result = await db
      .safeUpdateTable('comments')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return {
      success: Number(result.numUpdatedRows) > 0,
      numUpdatedRows: Number(result.numUpdatedRows)
    }
  }

  // Delete comment (logical delete)
  async deleteComment(id: number): Promise<{ success: boolean; numUpdatedRows: number }> {
    const result = await db
      .safeUpdateTable('comments')
      .set({
        is_delete: 1,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return {
      success: Number(result.numUpdatedRows) > 0,
      numUpdatedRows: Number(result.numUpdatedRows)
    }
  }

  // Batch update comment status
  async batchUpdateStatus(ids: number[], status: number): Promise<number> {
    const result = await db
      .safeUpdateTable('comments')
      .set({
        status,
        update_time: Date.now()
      })
      .where('id', 'in', ids)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return Number(result.numUpdatedRows)
  }

  // Batch delete comments
  async batchDeleteComments(ids: number[]): Promise<number> {
    const result = await db
      .safeUpdateTable('comments')
      .set({
        is_delete: 1,
        update_time: Date.now()
      })
      .where('id', 'in', ids)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return Number(result.numUpdatedRows)
  }

  // Count comments by status
  async countCommentsByStatus(status?: number): Promise<number> {
    let query = db
      .selectFrom('comments')
      .select((eb: any) => [eb.fn.count('id').as('count')])
      .where('is_delete', '=', 0)

    if (status) {
      query = query.where('status', '=', status)
    }

    const result = await query.executeTakeFirst()
    return Number(result?.['count']) || 0
  }

  // Get comment statistics
  async getCommentStats() {
    const [total, pending, approved, rejected] = await Promise.all([
      this.countCommentsByStatus(),
      this.countCommentsByStatus(10), // Pending
      this.countCommentsByStatus(20), // Approved
      this.countCommentsByStatus(-10) // Rejected
    ])

    return {
      total,
      pending,
      approved,
      rejected
    }
  }
}

export const commentService = new CommentService()
