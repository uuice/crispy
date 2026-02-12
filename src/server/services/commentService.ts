import { db } from '@src/libs/db'
import { DELETE_STATUS } from '../config/const'
import {
  CommentFilters,
  CommentWithAuthor,
  CreateComment,
  createCommentSchema,
  CreateSuccess,
  PaginatedResult,
  UpdateComment,
  updateCommentSchema,
  UpdateSuccess
} from '@src/types'

export class CommentService {
  // Get comments with pagination and filters
  async getComments(filters: CommentFilters): Promise<PaginatedResult<CommentWithAuthor>> {
    const page = Number(filters.page) || 1
    const pageSize = Number(filters.pageSize) || 10
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
      query = query.where('c.parent_id', '=', filters.parent_id)
    }
    if (filters.status !== undefined) {
      query = query.where('c.status', '=', filters.status)
    }
    if (filters.good_article !== undefined) {
      query = query.where('c.good_article', '=', filters.good_article)
    }
    if (filters.bad_article !== undefined) {
      query = query.where('c.bad_article', '=', filters.bad_article)
    }
    if (filters.not_article !== undefined) {
      query = query.where('c.not_article', '=', filters.not_article)
    }
    if (filters.create_time_start !== undefined) {
      query = query.where('c.create_time', '>=', filters.create_time_start)
    }
    if (filters.create_time_end !== undefined) {
      query = query.where('c.create_time', '<=', filters.create_time_end)
    }
    if (filters.update_time_start !== undefined) {
      query = query.where('c.update_time', '>=', filters.update_time_start)
    }
    if (filters.update_time_end !== undefined) {
      query = query.where('c.update_time', '<=', filters.update_time_end)
    }

    query = query.where('c.is_delete', '=', DELETE_STATUS.UN_DELETE)

    const [dataList, total] = await Promise.all([
      query.orderBy('c.create_time', 'desc').limit(pageSize).offset(offset).execute(),
      db
        .selectFrom('comments as c')
        .select((eb) => [eb.fn.count('c.id').as('count')])
        .$call((qb) => {
          if (filters.content) {
            qb = qb.where('c.content', 'like', `%${filters.content}%`)
          }
          if (filters.title) {
            qb = qb.where('c.title', 'like', `%${filters.title}%`)
          }
          if (filters.user_id !== undefined) {
            qb = qb.where('c.user_id', '=', filters.user_id)
          }
          if (filters.parent_id !== undefined) {
            qb = qb.where('c.parent_id', '=', filters.parent_id)
          }
          if (filters.status !== undefined) {
            qb = qb.where('c.status', '=', filters.status)
          }
          if (filters.good_article !== undefined) {
            qb = qb.where('c.good_article', '=', filters.good_article)
          }
          if (filters.bad_article !== undefined) {
            qb = qb.where('c.bad_article', '=', filters.bad_article)
          }
          if (filters.not_article !== undefined) {
            qb = qb.where('c.not_article', '=', filters.not_article)
          }
          if (filters.create_time_start !== undefined) {
            qb = qb.where('c.create_time', '>=', filters.create_time_start)
          }
          if (filters.create_time_end !== undefined) {
            qb = qb.where('c.create_time', '<=', filters.create_time_end)
          }
          if (filters.update_time_start !== undefined) {
            qb = qb.where('c.update_time', '>=', filters.update_time_start)
          }
          if (filters.update_time_end !== undefined) {
            qb = qb.where('c.update_time', '<=', filters.update_time_end)
          }
          qb = qb.where('c.is_delete', '=', DELETE_STATUS.UN_DELETE)
          return qb
        })
        .executeTakeFirst()
    ])

    return {
      dataList: dataList as CommentWithAuthor[],
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  // Get single comment by ID
  async getById(id: number): Promise<CommentWithAuthor | null> {
    const comment = await db
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
      .where('c.is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    return (comment as CommentWithAuthor) || null
  }

  // Create new comment
  async create(createData: CreateComment): Promise<CreateSuccess> {
    const validatedData = createCommentSchema.parse(createData)
    const now = Date.now()
    const newComment = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: DELETE_STATUS.UN_DELETE
    }

    const result = await db.insertInto('comments').values(newComment).executeTakeFirst()
    if (!result) throw new Error('创建评论失败')
    return { id: Number(result.insertId) }
  }

  // Update comment
  async update(id: number, updateData: UpdateComment): Promise<UpdateSuccess> {
    const validatedData = updateCommentSchema.parse(updateData)
    const result = await db
      .updateTable('comments')
      .set({ ...validatedData, update_time: Date.now() })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!result) throw new Error('更新评论失败')
    return { id }
  }

  // Delete comment (logical delete)
  async delete(id: number): Promise<boolean> {
    const result = await db
      .updateTable('comments')
      .set({
        is_delete: DELETE_STATUS.DELETE,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    return Number(result.numUpdatedRows) > 0
  }

  // Batch update comment status
  async batchUpdateStatus(ids: number[], status: number): Promise<number> {
    const result = await db
      .updateTable('comments')
      .set({
        status,
        update_time: Date.now()
      })
      .where('id', 'in', ids)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    return Number(result.numUpdatedRows)
  }

  // Batch delete comments
  async batchDeleteComments(ids: number[]): Promise<number> {
    const result = await db
      .updateTable('comments')
      .set({
        is_delete: DELETE_STATUS.DELETE,
        update_time: Date.now()
      })
      .where('id', 'in', ids)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    return Number(result.numUpdatedRows)
  }

  // Count comments by status
  async countCommentsByStatus(status?: number): Promise<number> {
    let query = db
      .selectFrom('comments')
      .select((eb) => [eb.fn.count('id').as('count')])
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    if (status !== undefined) {
      query = query.where('status', '=', status)
    }

    const result = await query.executeTakeFirst()
    return Number(result?.count) || 0
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
