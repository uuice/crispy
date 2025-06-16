import { DB, AccessToken } from '@src/db/db.d'
import { ExpressionBuilder, Insertable, Updateable } from 'kysely'
import { db } from '@src/libs/db'

/**
 * Service class for handling AccessToken operations
 */
export class AccessTokenService {
  /**
   * Create a new access token
   * @param data AccessToken data without id
   * @returns Created access token
   */
  async create(data: Insertable<DB['access_token']>): Promise<AccessToken> {
    const token = await db.insertInto('access_token').values(data).returningAll().executeTakeFirst()
    if (!token) throw new Error('Failed to create access token')
    return token as unknown as AccessToken
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
      .where('is_delete', '=', 0)
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
      .where('is_delete', '=', 0)
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
      .updateTable('access_token')
      .set({
        ...data,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
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
      .updateTable('access_token')
      .set({
        is_delete: 1,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()
    return result.numUpdatedRows > 0
  }

  /**
   * List access tokens with pagination
   * @param page Page number
   * @param pageSize Page size
   * @param filters Optional filters
   * @returns List of access tokens and total count
   */
  async list(
    page: number = 1,
    pageSize: number = 10,
    filters: {
      app_name?: string
      channel?: string
      status?: number
      user_id?: number
    } = {}
  ): Promise<{ items: AccessToken[]; total: number }> {
    let query = db.selectFrom('access_token').where('is_delete', '=', 0)

    // Apply filters
    if (filters.app_name) {
      query = query.where('app_name', '=', filters.app_name)
    }
    if (filters.channel) {
      query = query.where('channel', '=', filters.channel)
    }
    if (filters.status !== undefined) {
      query = query.where('status', '=', filters.status)
    }
    if (filters.user_id) {
      query = query.where('user_id', '=', filters.user_id)
    }

    // Get total count
    const total = await query
      .select((eb: ExpressionBuilder<DB, 'access_token'>) => eb.fn.count('id').as('count'))
      .executeTakeFirst()
      .then((result: { count: string | number | bigint } | undefined) => Number(result?.count) || 0)

    // Get paginated items
    const items = await query
      .selectAll()
      .orderBy('create_time', 'desc')
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .execute()

    return { items: items as unknown as AccessToken[], total }
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
      .where('status', '=', 10)
      .where('is_delete', '=', 0)
      .select('id')
      .executeTakeFirst()

    return !!result
  }
}
