import { db } from '@src/libs/db'
import { DELETE_STATUS } from '../config/const'
import {
  ApiLogEntity,
  ApiLogFilters,
  CreateApiLog,
  CreateSuccess,
  PaginatedResult,
  PaginationOptions,
  UpdateApiLog,
  UpdateSuccess
} from '@src/types'

export class ApiLogService {
  /**
   * Get a single API log by ID
   * @param id Log id
   * @returns Api log or null if not found
   */
  async getById(id: number): Promise<ApiLogEntity | null> {
    const log = await db
      .selectFrom('api_logs')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return log || null
  }

  /**
   * Get API logs with pagination and filters
   * @param filters Filter options
   * @param options Pagination options
   * @returns List of api logs and pagination info
   */
  async getApiLogs(filters: ApiLogFilters): Promise<PaginatedResult<ApiLogEntity>> {
    const { page = 1, pageSize = 10 } = filters
    const { user_id, method, create_time_start, create_time_end } = filters
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('api_logs').selectAll()

    // Apply filters
    if (user_id !== undefined) {
      query = query.where('user_id', '=', user_id)
    }
    if (method) {
      query = query.where('method', '=', method)
    }

    if (create_time_start !== undefined) {
      query = query.where('create_time', '>=', create_time_start)
    }
    if (create_time_end !== undefined) {
      query = query.where('create_time', '<=', create_time_end)
    }

    // Default to only non-deleted logs
    query = query.where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    const [apiLogs, total] = await Promise.all([
      query.orderBy('create_time', 'desc').limit(pageSize).offset(offset).execute(),
      db
        .selectFrom('api_logs')
        .select((eb) => [eb.fn.count('id').as('count')])
        .$call((qb) => {
          if (user_id !== undefined) {
            qb = qb.where('user_id', '=', user_id)
          }
          if (method) {
            qb = qb.where('method', '=', method)
          }
          if (create_time_start !== undefined) {
            qb = qb.where('create_time', '>=', create_time_start)
          }
          if (create_time_end !== undefined) {
            qb = qb.where('create_time', '<=', create_time_end)
          }
          qb = qb.where('is_delete', '=', DELETE_STATUS.UN_DELETE)
          return qb
        })
        .executeTakeFirst()
    ])

    return {
      dataList: apiLogs,
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
   * @param createData Log data
   * @returns Created log id
   */
  async create(createData: CreateApiLog): Promise<CreateSuccess> {
    const now = Date.now()
    const newLog = {
      ...createData,
      create_time: now,
      update_time: now,
      is_delete: DELETE_STATUS.UN_DELETE
    }

    const result = await db.insertInto('api_logs').values(newLog).executeTakeFirst()
    if (!result) throw new Error('创建API日志失败')
    return { id: Number(result.insertId) }
  }

  /**
   * Update an API log
   * @param id Log id
   * @param updateData Data to update
   * @returns Updated log id
   */
  async update(id: number, updateData: UpdateApiLog): Promise<UpdateSuccess> {
    const result = await db
      .updateTable('api_logs')
      .set({
        ...updateData,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!result) throw new Error('更新API日志失败')
    return { id }
  }

  /**
   * Soft delete API log
   * @param id Log id
   * @returns true if deleted successfully
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .updateTable('api_logs')
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
   * Get API logs by user ID
   * @param userId User id
   * @param limit Max number of results
   * @returns List of api logs
   */
  async getApiLogsByUserId(userId: number, limit = 10): Promise<ApiLogEntity[]> {
    return await db
      .selectFrom('api_logs')
      .selectAll()
      .where('user_id', '=', userId)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get API logs by method
   * @param method HTTP method
   * @param limit Max number of results
   * @returns List of api logs
   */
  async getApiLogsByMethod(method: string, limit = 10): Promise<ApiLogEntity[]> {
    return await db
      .selectFrom('api_logs')
      .selectAll()
      .where('method', '=', method)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get API logs by status code
   * @param statusCode HTTP status code
   * @param limit Max number of results
   * @returns List of api logs
   */
  async getApiLogsByStatusCode(statusCode: number, limit = 10): Promise<ApiLogEntity[]> {
    return await db
      .selectFrom('api_logs')
      .selectAll()
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }
}

export const apiLogService = new ApiLogService()
