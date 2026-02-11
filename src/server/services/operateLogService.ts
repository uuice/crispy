import { db } from '@src/libs/db'
import { DELETE_STATUS } from '../config/const'
import {
  CreateOperateLog,
  createOperateLogSchema,
  CreateSuccess,
  OperateLogEntity,
  OperateLogFilters,
  PaginatedResult,
  UpdateOperateLog,
  updateOperateLogSchema,
  UpdateSuccess
} from '@src/types'

export class OperateLogService {
  /**
   * Get single operate log by ID
   * @param id Log id
   * @returns Operate log or null if not found
   */
  async getById(id: number): Promise<OperateLogEntity | null> {
    const log = await db
      .selectFrom('operate_logs')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return log || null
  }

  /**
   * Get operate logs list with pagination and filters
   * @param filters Filter options
   * @param options Pagination options
   * @returns List of operate logs and pagination info
   */
  async getOperateLogs(filters: OperateLogFilters): Promise<PaginatedResult<OperateLogEntity>> {
    const page = Number(filters.page) || 1
    const pageSize = Number(filters.pageSize) || 10
    const { code, content, type_id, user_id } = filters
    const start_time = filters.create_time
    const end_time = filters.update_time
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('operate_logs').selectAll()

    // Apply filters
    if (code) {
      query = query.where('code', 'like', `%${code}%`)
    }
    if (content) {
      query = query.where('content', 'like', `%${content}%`)
    }
    if (type_id !== undefined) {
      query = query.where('type_id', '=', type_id)
    }
    if (user_id !== undefined) {
      query = query.where('user_id', '=', user_id)
    }
    if (start_time !== undefined) {
      query = query.where('create_time', '>=', start_time)
    }
    if (end_time !== undefined) {
      query = query.where('create_time', '<=', end_time)
    }

    // Default to only non-deleted logs
    query = query.where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    const [logs, total] = await Promise.all([
      query.orderBy('create_time', 'desc').limit(pageSize).offset(offset).execute(),
      db
        .selectFrom('operate_logs')
        .select((eb) => [eb.fn.count('id').as('count')])
        .$call((qb) => {
          if (code) {
            qb = qb.where('code', 'like', `%${code}%`)
          }
          if (content) {
            qb = qb.where('content', 'like', `%${content}%`)
          }
          if (type_id !== undefined) {
            qb = qb.where('type_id', '=', type_id)
          }
          if (user_id !== undefined) {
            qb = qb.where('user_id', '=', user_id)
          }
          if (start_time !== undefined) {
            qb = qb.where('create_time', '>=', start_time)
          }
          if (end_time !== undefined) {
            qb = qb.where('create_time', '<=', end_time)
          }
          qb = qb.where('is_delete', '=', DELETE_STATUS.UN_DELETE)
          return qb
        })
        .executeTakeFirst()
    ])

    return {
      dataList: logs,
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
   * @param createData Log data
   * @returns Created log id
   */
  async create(createData: CreateOperateLog): Promise<CreateSuccess> {
    const validatedData = createOperateLogSchema.parse(createData)
    const now = Date.now()
    const newLog = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: DELETE_STATUS.UN_DELETE
    }

    const result = await db.insertInto('operate_logs').values(newLog).executeTakeFirst()
    if (!result) throw new Error('创建操作日志失败')
    return { id: Number(result.insertId) }
  }

  /**
   * Update operate log by ID
   * @param id Log id
   * @param updateData Data to update
   * @returns Updated log id
   */
  async update(id: number, updateData: UpdateOperateLog): Promise<UpdateSuccess> {
    const validatedData = updateOperateLogSchema.parse(updateData)
    const result = await db
      .updateTable('operate_logs')
      .set({
        ...validatedData,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!result) throw new Error('更新操作日志失败')
    return { id }
  }

  /**
   * Soft delete operate log
   * @param id Log id
   * @returns true if deleted successfully
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .updateTable('operate_logs')
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
   * Get operate logs by type
   * @param typeId Type id
   * @returns List of operate logs
   */
  async getOperateLogsByType(typeId: number): Promise<OperateLogEntity[]> {
    return await db
      .selectFrom('operate_logs')
      .selectAll()
      .where('type_id', '=', typeId)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Get operate logs by user
   * @param userId User id
   * @returns List of operate logs
   */
  async getOperateLogsByUser(userId: number): Promise<OperateLogEntity[]> {
    return await db
      .selectFrom('operate_logs')
      .selectAll()
      .where('user_id', '=', userId)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Search operate logs by code or content
   * @param searchTerm Search keyword
   * @returns List of operate logs
   */
  async searchOperateLogs(searchTerm: string): Promise<OperateLogEntity[]> {
    return await db
      .selectFrom('operate_logs')
      .selectAll()
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .where((eb) =>
        eb.or([eb('code', 'like', `%${searchTerm}%`), eb('content', 'like', `%${searchTerm}%`)])
      )
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Get operate logs count by type
   * @returns List of type counts
   */
  async getOperateLogsCountByType(): Promise<{ type_id: number; count: number }[]> {
    return (await db
      .selectFrom('operate_logs')
      .select((eb) => ['type_id', eb.fn.count('id').as('count')])
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .groupBy('type_id')
      .execute()) as { type_id: number; count: number }[]
  }

  /**
   * Get operate logs count by user
   * @returns List of user counts
   */
  async getOperateLogsCountByUser(): Promise<{ user_id: number; count: number }[]> {
    return (await db
      .selectFrom('operate_logs')
      .select((eb) => ['user_id', eb.fn.count('id').as('count')])
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .groupBy('user_id')
      .execute()) as { user_id: number; count: number }[]
  }

  /**
   * Get operate logs statistics
   * @returns Statistics data
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
        .select((eb) => [
          eb.fn.count('id').as('total'),
          eb.fn
            .sum<number>(
              eb.case().when('is_delete', '=', DELETE_STATUS.DELETE).then(1).else(0).end()
            )
            .as('deleted')
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
   * @param limit Max number of results
   * @returns List of operate logs
   */
  async getRecentOperateLogs(limit: number = 10): Promise<OperateLogEntity[]> {
    return await db
      .selectFrom('operate_logs')
      .selectAll()
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }
}

export const operateLogService = new OperateLogService()
