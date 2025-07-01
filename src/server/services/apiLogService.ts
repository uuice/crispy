import { db } from '@src/libs/db'
import { sql } from 'kysely'

export interface CreateApiLogData {
  user_id?: number
  method: string
  path: string
  request_body?: string
  response_body?: string
  status_code: number
  ip?: string
  user_agent?: string
  duration?: number
  status?: number
}

export type UpdateApiLogData = Partial<CreateApiLogData>

export interface ApiLogFilters {
  user_id?: number
  method?: string
  path?: string
  status_code?: number
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

export class ApiLogService {
  /**
   * Get a single API log by ID
   */
  async getApiLogById(id: number) {
    return await db
      .selectFrom('api_logs')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()
  }

  /**
   * Get API logs with pagination and filters
   */
  async getApiLogs(
    filters: ApiLogFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResult<any>> {
    const { page, pageSize } = pagination
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('api_logs').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (filters.user_id !== undefined && !isNaN(filters.user_id)) {
      query = query.where(sql.ref('user_id'), '=', filters.user_id)
    }
    if (filters.method) {
      query = query.where(sql.ref('method'), '=', filters.method)
    }
    if (filters.path) {
      query = query.where(sql.ref('path'), 'like', `%${filters.path}%`)
    }
    if (filters.status_code !== undefined && !isNaN(filters.status_code)) {
      query = query.where(sql.ref('status_code'), '=', filters.status_code)
    }
    if (filters.start_time) {
      query = query.where(sql.ref('create_time'), '>=', filters.start_time)
    }
    if (filters.end_time) {
      query = query.where(sql.ref('create_time'), '<=', filters.end_time)
    }

    // Order by create_time desc by default
    query = query.orderBy('create_time', 'desc')

    const [apiLogs, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    return {
      data: apiLogs,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Create a new API log
   */
  async createApiLog(data: CreateApiLogData) {
    const now = Date.now()
    const newApiLog = {
      ...data,
      create_time: now,
      update_time: now,
      is_delete: 0,
      query: '',
      body: ''
    }

    const result = await db.safeInsertInto('api_logs').values(newApiLog).executeTakeFirst()

    return {
      id: Number(result.insertId),
      ...newApiLog
    }
  }

  /**
   * Update an API log
   */
  async updateApiLog(id: number, data: UpdateApiLogData) {
    const updateData = {
      ...data,
      update_time: Date.now()
    }

    const result = await db
      .safeUpdateTable('api_logs')
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
   * Delete an API log (logical delete)
   */
  async deleteApiLog(id: number) {
    const result = await db
      .safeUpdateTable('api_logs')
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
   * Get API logs by user ID
   */
  async getApiLogsByUserId(userId: number, limit = 10) {
    return await db
      .selectFrom('api_logs')
      .selectAll()
      .where('user_id', '=', userId)
      .where('is_delete', '=', 0)
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get API logs by method
   */
  async getApiLogsByMethod(method: string, limit = 10) {
    return await db
      .selectFrom('api_logs')
      .selectAll()
      .where('method', '=', method)
      .where('is_delete', '=', 0)
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get API logs by status code
   */
  async getApiLogsByStatusCode(statusCode: number, limit = 10) {
    return await db
      .selectFrom('api_logs')
      .selectAll()
      .where(sql.ref('status_code'), '=', statusCode)
      .where('is_delete', '=', 0)
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }
}

export const apiLogService = new ApiLogService()
