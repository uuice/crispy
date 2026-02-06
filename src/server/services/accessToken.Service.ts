import { db } from '@src/libs/db'
import { DELETE_STATUS, PUBLISH_STATUS } from '../config/const'
import {
  AccessTokenEntity,
  AccessTokenFilters,
  CheckAccessTokenData,
  checkTokenSchema,
  CreateAccessToken,
  createAccessTokenSchema,
  CreateSuccess,
  PaginatedResult,
  PaginationOptions,
  UpdateAccessToken,
  updateAccessTokenSchema,
  UpdateSuccess
} from '@src/types'
import { generateRandomToken } from '../utils/token'

/**
 * Service class for handling AccessToken operations
 */
export class AccessTokenService {
  /**
   * Create a new access token
   * @param data AccessToken data without id
   * @returns Created access token
   */
  async create(createData: CreateAccessToken): Promise<CreateSuccess> {
    // 验证
    const validatedData = createAccessTokenSchema.parse(createData)
    const randomToken = generateRandomToken()
    const now = Date.now()
    const newToken = {
      ...validatedData,
      token: randomToken,
      create_time: now,
      update_time: now,
      is_delete: DELETE_STATUS.UN_DELETE
    }
    const result = await db.insertInto('access_token').values(newToken).executeTakeFirst()
    if (!result) throw new Error('创建token失败')
    return { id: Number(result.insertId) }
  }

  /**
   * Get access token by id
   * @param id Access token id
   * @returns Access token or null if not found
   */
  async getById(id: number): Promise<AccessTokenEntity | null> {
    const token = await db
      .selectFrom('access_token')
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .selectAll()
      .executeTakeFirst()
    return token || null
  }

  /**
   * Get access token by user id
   * @param userId User id
   * @returns Access token or null if not found
   */
  async getByUserId(userId: number): Promise<AccessTokenEntity | null> {
    const token = await db
      .selectFrom('access_token')
      .where('user_id', '=', userId)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .selectAll()
      .executeTakeFirst()
    return token || null
  }

  /**
   * Update access token
   * @param id Access token id
   * @param data Data to update
   * @returns Updated access token
   */
  async update(id: number, updateData: UpdateAccessToken): Promise<UpdateSuccess> {
    const validatedData = updateAccessTokenSchema.parse(updateData)
    const result = await db
      .updateTable('access_token')
      .set({
        ...validatedData,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    if (!result) throw new Error('更新token失败')
    return { id }
  }

  /**
   * Soft delete access token
   * @param id Access token id
   * @returns true if deleted successfully
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .updateTable('access_token')
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
   * Get access tokens list with pagination
   * @param options Pagination and filter options
   * @returns List of access tokens and pagination info
   */
  async getAccessTokens(filters: AccessTokenFilters): Promise<PaginatedResult<AccessTokenEntity>> {
    const page = Number(filters.page) || 1
    const pageSize = Number(filters.pageSize) || 10
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

    if (status !== undefined) {
      query = query.where('status', '=', status)
    }

    if (user_id !== undefined) {
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
          if (status !== undefined) {
            qb = qb.where('status', '=', status)
          }
          if (user_id !== undefined) {
            qb = qb.where('user_id', '=', user_id)
          }
          qb = qb.where('is_delete', '=', DELETE_STATUS.UN_DELETE)
          return qb
        })
        .executeTakeFirst()
    ])

    return {
      dataList: tokens,
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
  async checkToken(checkData: CheckAccessTokenData): Promise<boolean> {
    const validatedData = checkTokenSchema.parse(checkData)
    const { app_name, channel, token } = validatedData

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
