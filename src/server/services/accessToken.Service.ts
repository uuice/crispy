import { DB, AccessToken } from '@src/db/db.d'
import { ExpressionBuilder, Insertable, Updateable } from 'kysely'
import { db } from '@src/libs/db'
import { DELETE_STATUS, PUBLISH_STATUS, STATUS_PUBLISHED } from '../config/const'
import z from 'zod'

// Types
export interface AccessTokenFilters {
  app_name?: string
  channel?: string
  status?: number
  user_id?: number
  is_delete?: number
  update_time?: number
  create_time?: number
}

export interface PaginationOptions {
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

// Validation schemas
const createAccessTokenSchema = z.object({
  app_name: z.string().min(1, 'app_name不能为空'),
  channel: z.string().min(1, 'channel不能为空'),
  user_id: z.number().min(1, 'user_id不能为空'),
  status: z.number().default(10)
})

const updateAccessTokenSchema = createAccessTokenSchema.partial()

/**
 * Service class for handling AccessToken operations
 */
export class AccessTokenService {
  /**
   * Create a new access token
   * @param data AccessToken data without id
   * @returns Created access token
   */
  async create(data: Insertable<DB['access_token']>): Promise<any> {
    const now = Date.now()
    const newToken = {
      ...data,
      create_time: now,
      update_time: now,
      is_delete: DELETE_STATUS.UN_DELETE
    }
    const result = await db.safeInsertInto('access_token').values(newToken).executeTakeFirst()
    if (!result) throw new Error('创建token失败')

    const { token: _, ...tokenWithoutToken } = {
      id: Number(result.insertId),
      ...newToken
    }

    return tokenWithoutToken
  }

  /**
   * Get access token by id
   * @param id Access token id
   * @returns Access token or null if not found
   */
  async getById(id: number): Promise<AccessToken | null> {
    const token = await db
      .selectFrom('access_token')
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .selectAll()
      .executeTakeFirst()
    return token as unknown as AccessToken | null
  }

  /**
   * Get access token by user id
   * @param userId User id
   * @returns Access token or null if not found
   */
  async getByUserId(userId: number): Promise<AccessToken | null> {
    const token = await db
      .selectFrom('access_token')
      .where('user_id', '=', userId)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .selectAll()
      .executeTakeFirst()
    return token as unknown as AccessToken | null
  }

  /**
   * Update access token
   * @param id Access token id
   * @param data Data to update
   * @returns Updated access token
   */
  async update(id: number, data: Updateable<DB['access_token']>): Promise<AccessToken | null> {
    const token = await db
      .safeUpdateTable('access_token')
      .set({
        ...data,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .returningAll()
      .executeTakeFirst()
    return token as unknown as AccessToken | null
  }

  /**
   * Soft delete access token
   * @param id Access token id
   * @returns true if deleted successfully
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .safeUpdateTable('access_token')
      .set({
        is_delete: DELETE_STATUS.DELETE,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return result.numUpdatedRows > 0
  }

  /**
   * Get access tokens list with pagination
   * @param options Pagination and filter options
   * @returns List of access tokens and pagination info
   */
  async getAccessTokens(
    filters: AccessTokenFilters,
    options: PaginationOptions
  ): Promise<PaginatedResult<AccessToken>> {
    const { page, pageSize } = options
    const { app_name, channel, status, user_id } = filters
    const offset = (page - 1) * pageSize

    // Build query conditions
    let query = db.selectFrom('access_token').selectAll()

    // Apply filters
    if (app_name) {
      query = query.where('app_name', 'like', `%${app_name}%`)
    }

    if (channel) {
      query = query.where('channel', 'like', `%${channel}%`)
    }

    if (status) {
      query = query.where('status', '=', status)
    }

    if (user_id) {
      query = query.where('user_id', '=', user_id)
    }

    // Default to only non-deleted tokens
    query = query.where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    const [tokens, total] = await Promise.all([
      query.orderBy('create_time', 'desc').limit(pageSize).offset(offset).execute(),
      db
        .selectFrom('access_token')
        .select((eb) => [eb.fn.count('id').as('count')])
        .$call((qb) => {
          // Apply same filters to count query
          if (app_name) {
            qb = qb.where('app_name', 'like', `%${app_name}%`)
          }
          if (channel) {
            qb = qb.where('channel', 'like', `%${channel}%`)
          }
          if (status) {
            qb = qb.where('status', '=', status)
          }
          if (user_id) {
            qb = qb.where('user_id', '=', user_id)
          }
          qb = qb.where('is_delete', '=', DELETE_STATUS.UN_DELETE)
          return qb
        })
        .executeTakeFirst()
    ])

    return {
      dataList: tokens as unknown as AccessToken[],
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Check if access token is valid
   * @param app_name Application name
   * @param channel Channel name
   * @param token Access token
   * @returns true if token is valid
   */
  async checkToken(app_name: string, channel: string, token: string): Promise<boolean> {
    const result = await db
      .selectFrom('access_token')
      .where('app_name', '=', app_name)
      .where('channel', '=', channel)
      .where('token', '=', token)
      .where('status', '=', PUBLISH_STATUS.PUBLISHED)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .select('id')
      .executeTakeFirst()

    return !!result
  }
}

export const accessTokenService = new AccessTokenService()

// Export schemas for validation
export { createAccessTokenSchema, updateAccessTokenSchema }
