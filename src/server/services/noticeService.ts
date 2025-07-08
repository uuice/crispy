import { db } from '@src/server/libs/db'
import { sql } from 'kysely'

// Data interfaces
export interface CreateNoticeData {
  title: string
  content: string
  from_user_id: number
  publish_time?: number
  tolds?: string
  status: number
}

export type UpdateNoticeData = Partial<CreateNoticeData>

export interface NoticeFilters {
  title?: string
  status?: number
  startTime?: number
  endTime?: number
}

export interface NoticePaginationParams {
  page: number
  pageSize: number
}

export interface Notice {
  id: number
  title: string
  content: string
  from_user_id: number
  publish_time?: number
  tolds?: string
  status: number
  create_time: number
  update_time: number
  is_delete: number
}

export interface PaginatedNoticesResult {
  dataList: Notice[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export class NoticeService {
  /**
   * Get single notice by ID
   */
  async getNoticeById(id: number): Promise<Notice | null> {
    const result = await db
      .selectFrom('notices')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return result as Notice | null
  }

  /**
   * Get notices list with pagination and filters
   */
  async getNotices(
    pagination: NoticePaginationParams,
    filters?: NoticeFilters
  ): Promise<PaginatedNoticesResult> {
    const { page, pageSize } = pagination
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('notices').selectAll().where('is_delete', '=', 0)

    // Apply filters
    if (filters) {
      if (filters.title) {
        query = query.where('title', 'like', `%${filters.title}%`)
      }
      if (filters.status !== undefined) {
        query = query.where('status', '=', filters.status)
      }
      if (filters.startTime) {
        query = query.where('create_time', '>=', filters.startTime)
      }
      if (filters.endTime) {
        query = query.where('create_time', '<=', filters.endTime)
      }
    }

    // Order by create_time desc by default
    query = query.orderBy('create_time', 'desc')

    const [notices, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    return {
      dataList: notices as Notice[],
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
   */
  async createNotice(data: CreateNoticeData): Promise<Notice> {
    const now = Date.now()
    const newNotice = {
      ...data,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.safeInsertInto('notices').values(newNotice).executeTakeFirst()

    return {
      id: Number(result.insertId),
      ...newNotice
    }
  }

  /**
   * Update notice by ID
   */
  async updateNotice(id: number, data: UpdateNoticeData): Promise<boolean> {
    const updateData = {
      ...data,
      update_time: Date.now()
    }

    const result = await db
      .safeUpdateTable('notices')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return result.numUpdatedRows > 0n
  }

  /**
   * Delete notice (logical delete)
   */
  async deleteNotice(id: number): Promise<boolean> {
    const result = await db
      .safeUpdateTable('notices')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return result.numUpdatedRows > 0n
  }

  /**
   * Get notices by status
   */
  async getNoticesByStatus(status: number): Promise<Notice[]> {
    const result = await db
      .selectFrom('notices')
      .selectAll()
      .where('status', '=', status)
      .where('is_delete', '=', 0)
      .orderBy('create_time', 'desc')
      .execute()

    return result as Notice[]
  }

  /**
   * Search notices by title or content
   */
  async searchNotices(searchTerm: string): Promise<Notice[]> {
    const result = await db
      .selectFrom('notices')
      .selectAll()
      .where('is_delete', '=', 0)
      .where((eb) =>
        eb.or([eb('title', 'like', `%${searchTerm}%`), eb('content', 'like', `%${searchTerm}%`)])
      )
      .orderBy('create_time', 'desc')
      .execute()

    return result as Notice[]
  }

  /**
   * Get notices count by status
   */
  async getNoticesCountByStatus(): Promise<{ status: number; count: number }[]> {
    return await db
      .selectFrom('notices')
      .select(['status', sql<number>`count(*)`.as('count')])
      .where('is_delete', '=', 0)
      .groupBy('status')
      .execute()
  }

  /**
   * Check if notice exists by title
   */
  async checkNoticeExistsByTitle(title: string, excludeId?: number): Promise<boolean> {
    let query = db
      .selectFrom('notices')
      .select('id')
      .where('title', '=', title)
      .where('is_delete', '=', 0)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    const result = await query.executeTakeFirst()
    return !!result
  }

  /**
   * Get notices statistics
   */
  async getNoticesStats(): Promise<{
    total: number
    active: number
    inactive: number
    deleted: number
  }> {
    const stats = await db
      .selectFrom('notices')
      .select([
        sql<number>`count(*)`.as('total'),
        sql<number>`sum(case when status = 10 then 1 else 0 end)`.as('active'),
        sql<number>`sum(case when status = 0 then 1 else 0 end)`.as('inactive'),
        sql<number>`sum(case when is_delete = 10 then 1 else 0 end)`.as('deleted')
      ])
      .executeTakeFirst()

    return {
      total: Number(stats?.total) || 0,
      active: Number(stats?.active) || 0,
      inactive: Number(stats?.inactive) || 0,
      deleted: Number(stats?.deleted) || 0
    }
  }
}

// Export singleton instance
export const noticeService = new NoticeService()
