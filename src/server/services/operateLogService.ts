import { db } from '@src/libs/db'
import { sql } from 'kysely'

// Data interfaces
export interface CreateOperateLogData {
  code: string
  content: string
  type_id: number
  user_id: number
}

export type UpdateOperateLogData = Partial<CreateOperateLogData>

export interface OperateLogFilters {
  code?: string
  typeId?: number
  userId?: number
  startTime?: number
  endTime?: number
}

export interface OperateLogPaginationParams {
  page: number
  pageSize: number
}

export interface OperateLog {
  id: number
  code: string
  content: string
  type_id: number
  user_id: number
  create_time: number
  update_time: number
  is_delete: number
}

export interface PaginatedOperateLogsResult {
  data: OperateLog[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export class OperateLogService {
  /**
   * Get single operate log by ID
   */
  async getOperateLogById(id: number): Promise<OperateLog | null> {
    const result = await db
      .selectFrom('operate_logs')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return result as OperateLog | null
  }

  /**
   * Get operate logs list with pagination and filters
   */
  async getOperateLogs(
    pagination: OperateLogPaginationParams,
    filters?: OperateLogFilters
  ): Promise<PaginatedOperateLogsResult> {
    const { page, pageSize } = pagination
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('operate_logs').selectAll().where('is_delete', '=', 0)

    // Apply filters
    if (filters) {
      if (filters.code) {
        query = query.where('code', 'like', `%${filters.code}%`)
      }
      if (filters.typeId !== undefined) {
        query = query.where('type_id', '=', filters.typeId)
      }
      if (filters.userId !== undefined) {
        query = query.where('user_id', '=', filters.userId)
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

    const [logs, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    return {
      data: logs as OperateLog[],
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Create new operate log
   */
  async createOperateLog(data: CreateOperateLogData): Promise<OperateLog> {
    const now = Date.now()
    const newLog = {
      ...data,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.insertInto('operate_logs').values(newLog).executeTakeFirst()

    return {
      id: Number(result.insertId),
      ...newLog
    }
  }

  /**
   * Update operate log by ID
   */
  async updateOperateLog(id: number, data: UpdateOperateLogData): Promise<boolean> {
    const updateData = {
      ...data,
      update_time: Date.now()
    }

    const result = await db
      .updateTable('operate_logs')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return result.numUpdatedRows > 0n
  }

  /**
   * Delete operate log (logical delete)
   */
  async deleteOperateLog(id: number): Promise<boolean> {
    const result = await db
      .updateTable('operate_logs')
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
   * Get operate logs by type
   */
  async getOperateLogsByType(typeId: number): Promise<OperateLog[]> {
    const result = await db
      .selectFrom('operate_logs')
      .selectAll()
      .where('type_id', '=', typeId)
      .where('is_delete', '=', 0)
      .orderBy('create_time', 'desc')
      .execute()

    return result as OperateLog[]
  }

  /**
   * Get operate logs by user
   */
  async getOperateLogsByUser(userId: number): Promise<OperateLog[]> {
    const result = await db
      .selectFrom('operate_logs')
      .selectAll()
      .where('user_id', '=', userId)
      .where('is_delete', '=', 0)
      .orderBy('create_time', 'desc')
      .execute()

    return result as OperateLog[]
  }

  /**
   * Search operate logs by code or content
   */
  async searchOperateLogs(searchTerm: string): Promise<OperateLog[]> {
    const result = await db
      .selectFrom('operate_logs')
      .selectAll()
      .where('is_delete', '=', 0)
      .where((eb) =>
        eb.or([eb('code', 'like', `%${searchTerm}%`), eb('content', 'like', `%${searchTerm}%`)])
      )
      .orderBy('create_time', 'desc')
      .execute()

    return result as OperateLog[]
  }

  /**
   * Get operate logs count by type
   */
  async getOperateLogsCountByType(): Promise<{ type_id: number; count: number }[]> {
    return await db
      .selectFrom('operate_logs')
      .select(['type_id', sql<number>`count(*)`.as('count')])
      .where('is_delete', '=', 0)
      .groupBy('type_id')
      .execute()
  }

  /**
   * Get operate logs count by user
   */
  async getOperateLogsCountByUser(): Promise<{ user_id: number; count: number }[]> {
    return await db
      .selectFrom('operate_logs')
      .select(['user_id', sql<number>`count(*)`.as('count')])
      .where('is_delete', '=', 0)
      .groupBy('user_id')
      .execute()
  }

  /**
   * Get operate logs statistics
   */
  async getOperateLogsStats(): Promise<{
    total: number
    deleted: number
    byType: { type_id: number; count: number }[]
    byUser: { user_id: number; count: number }[]
  }> {
    const [stats, byType, byUser] = await Promise.all([
      db
        .selectFrom('operate_logs')
        .select([
          sql<number>`count(*)`.as('total'),
          sql<number>`sum(case when is_delete = 10 then 1 else 0 end)`.as('deleted')
        ])
        .executeTakeFirst(),
      this.getOperateLogsCountByType(),
      this.getOperateLogsCountByUser()
    ])

    return {
      total: Number(stats?.total) || 0,
      deleted: Number(stats?.deleted) || 0,
      byType,
      byUser
    }
  }

  /**
   * Get recent operate logs
   */
  async getRecentOperateLogs(limit: number = 10): Promise<OperateLog[]> {
    const result = await db
      .selectFrom('operate_logs')
      .selectAll()
      .where('is_delete', '=', 0)
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()

    return result as OperateLog[]
  }
}

// Export singleton instance
export const operateLogService = new OperateLogService()
