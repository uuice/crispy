import { db } from '@src/libs/db'
import { DELETE_STATUS } from '../config/const'
import {
  CreateNotice,
  createNoticeSchema,
  CreateSuccess,
  NoticeEntity,
  NoticeFilters,
  PaginatedResult,
  UpdateNotice,
  updateNoticeSchema,
  UpdateSuccess
} from '@src/types'

export class NoticeService {
  /**
   * Get single notice by ID
   * @param id Notice id
   * @returns Notice or null if not found
   */
  async getById(id: number): Promise<NoticeEntity | null> {
    const notice = await db
      .selectFrom('notices')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return notice || null
  }

  /**
   * Get notices list with pagination and filters
   * @param filters Filter options
   * @param options Pagination options
   * @returns List of notices and pagination info
   */
  async getNotices(filters: NoticeFilters): Promise<PaginatedResult<NoticeEntity>> {
    const page = Number(filters.page) || 1
    const pageSize = Number(filters.pageSize) || 10
    const {
      title,
      status,
      create_time_start,
      create_time_end,
      update_time_start,
      update_time_end
    } = filters
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('notices').selectAll()

    // Apply filters
    if (title) {
      query = query.where('title', 'like', `%${title}%`)
    }

    if (status !== undefined) {
      query = query.where('status', '=', status)
    }

    if (create_time_start !== undefined) {
      query = query.where('create_time', '>=', create_time_start)
    }

    if (create_time_end !== undefined) {
      query = query.where('create_time', '<=', create_time_end)
    }

    if (update_time_start !== undefined) {
      query = query.where('update_time', '>=', update_time_start)
    }

    if (update_time_end !== undefined) {
      query = query.where('update_time', '<=', update_time_end)
    }

    // Default to only non-deleted notices
    query = query.where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    const [notices, total] = await Promise.all([
      query.orderBy('create_time', 'desc').limit(pageSize).offset(offset).execute(),
      db
        .selectFrom('notices')
        .select((eb) => [eb.fn.count('id').as('count')])
        .$call((qb) => {
          // Apply same filters to count query
          if (title) {
            qb = qb.where('title', 'like', `%${title}%`)
          }
          if (status !== undefined) {
            qb = qb.where('status', '=', status)
          }
          if (create_time_start !== undefined) {
            qb = qb.where('create_time', '>=', create_time_start)
          }
          if (create_time_end !== undefined) {
            qb = qb.where('create_time', '<=', create_time_end)
          }
          if (update_time_start !== undefined) {
            qb = qb.where('update_time', '>=', update_time_start)
          }
          if (update_time_end !== undefined) {
            qb = qb.where('update_time', '<=', update_time_end)
          }
          qb = qb.where('is_delete', '=', DELETE_STATUS.UN_DELETE)
          return qb
        })
        .executeTakeFirst()
    ])

    return {
      dataList: notices,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Create new notice
   * @param createData Notice data without id
   * @returns Created notice id
   */
  async create(createData: CreateNotice): Promise<CreateSuccess> {
    // 验证
    const validatedData = createNoticeSchema.parse(createData)
    const now = Date.now()
    const newNotice = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: DELETE_STATUS.UN_DELETE
    }

    const result = await db.insertInto('notices').values(newNotice).executeTakeFirst()
    if (!result) throw new Error('创建公告失败')
    return { id: Number(result.insertId) }
  }

  /**
   * Update notice by ID
   * @param id Notice id
   * @param updateData Data to update
   * @returns Updated notice id
   */
  async update(id: number, updateData: UpdateNotice): Promise<UpdateSuccess> {
    const validatedData = updateNoticeSchema.parse(updateData)
    const result = await db
      .updateTable('notices')
      .set({
        ...validatedData,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!result) throw new Error('更新公告失败')
    return { id }
  }

  /**
   * Soft delete notice
   * @param id Notice id
   * @returns true if deleted successfully
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .updateTable('notices')
      .set({
        is_delete: DELETE_STATUS.DELETE,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return Number(result.numUpdatedRows) > 0
  }

  /**
   * Get notices by status
   * @param status Notice status
   * @returns List of notices
   */
  async getNoticesByStatus(status: number): Promise<NoticeEntity[]> {
    return await db
      .selectFrom('notices')
      .selectAll()
      .where('status', '=', status)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Search notices by title or content
   * @param searchTerm Search term
   * @returns List of notices
   */
  async searchNotices(searchTerm: string): Promise<NoticeEntity[]> {
    return await db
      .selectFrom('notices')
      .selectAll()
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .where((eb) =>
        eb.or([eb('title', 'like', `%${searchTerm}%`), eb('content', 'like', `%${searchTerm}%`)])
      )
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Check if notice exists by title
   * @param title Notice title
   * @param excludeId Notice id to exclude from check
   * @returns true if exists
   */
  async checkNoticeExistsByTitle(title: string, excludeId?: number): Promise<boolean> {
    let query = db
      .selectFrom('notices')
      .select('id')
      .where('title', '=', title)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    const result = await query.executeTakeFirst()
    return !!result
  }
}

export const noticeService = new NoticeService()
