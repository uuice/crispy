import { db } from '@src/libs/db'
import { env } from '../config/env'
import { DELETE_STATUS } from '../config/const'
import {
  CacheEntity,
  CacheFilters,
  CreateCache,
  createCacheSchema,
  CreateSuccess,
  PaginatedResult,
  PaginationOptions,
  UpdateCache,
  updateCacheSchema,
  UpdateSuccess
} from '@src/types'

export class CacheService {
  /**
   * Get a single cache by ID
   * @param id Cache id
   * @returns Cache or null if not found
   */
  async getById(id: number): Promise<CacheEntity | null> {
    const cache = await db
      .selectFrom('caches')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return cache || null
  }

  /**
   * Get caches with pagination and filters
   * @param filters Filter options
   * @param options Pagination options
   * @returns List of caches and pagination info
   */
  async getCaches(filters: CacheFilters): Promise<PaginatedResult<CacheEntity>> {
    const { page = 1, pageSize = 10 } = filters
    const { hash, status } = filters
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('caches').selectAll()

    // Apply filters
    if (hash) {
      query = query.where('hash', 'like', `%${hash}%`)
    }
    if (status !== undefined) {
      query = query.where('status', '=', status)
    }

    // Default to only non-deleted caches
    query = query.where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    const [caches, total] = await Promise.all([
      query.orderBy('create_time', 'desc').limit(pageSize).offset(offset).execute(),
      db
        .selectFrom('caches')
        .select((eb) => [eb.fn.count('id').as('count')])
        .$call((qb) => {
          if (hash) {
            qb = qb.where('hash', 'like', `%${hash}%`)
          }
          if (status !== undefined) {
            qb = qb.where('status', '=', status)
          }
          qb = qb.where('is_delete', '=', DELETE_STATUS.UN_DELETE)
          return qb
        })
        .executeTakeFirst()
    ])

    return {
      dataList: caches,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Create a new cache
   * @param createData Cache data
   * @returns Created cache id
   */
  async create(createData: CreateCache): Promise<CreateSuccess> {
    const validatedData = createCacheSchema.parse(createData)
    const now = Date.now()
    const newCache = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: DELETE_STATUS.UN_DELETE
    }

    const result = await db.insertInto('caches').values(newCache).executeTakeFirst()
    if (!result) throw new Error('创建缓存失败')
    return { id: Number(result.insertId) }
  }

  /**
   * Update a cache
   * @param id Cache id
   * @param updateData Data to update
   * @returns Updated cache id
   */
  async update(id: number, updateData: UpdateCache): Promise<UpdateSuccess> {
    const validatedData = updateCacheSchema.parse(updateData)
    const result = await db
      .updateTable('caches')
      .set({
        ...validatedData,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!result) throw new Error('更新缓存失败')
    return { id }
  }

  /**
   * Soft delete cache
   * @param id Cache id
   * @returns true if deleted successfully
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .updateTable('caches')
      .set({
        is_delete: DELETE_STATUS.DELETE,
        status: -10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return Number(result.numUpdatedRows) > 0
  }

  /**
   * Get cache by hash
   * @param hash Cache hash
   * @returns Cache or null if not found
   */
  async getCacheByHash(hash: string): Promise<CacheEntity | null> {
    const cache = await db
      .selectFrom('caches')
      .selectAll()
      .where('hash', '=', hash)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return cache || null
  }

  /**
   * Get caches by status
   * @param status Cache status
   * @param limit Max number of results
   * @returns List of caches
   */
  async getCachesByStatus(status: number, limit = 10): Promise<CacheEntity[]> {
    return await db
      .selectFrom('caches')
      .selectAll()
      .where('status', '=', status)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Clear expired caches
   * @returns Number of cleared caches
   */
  async clearExpiredCaches(): Promise<number> {
    const expireTime = Date.now() - Number(env['PAGE_CACHE_TTL'] || 60) * 1000
    const result = await db
      .updateTable('caches')
      .set({
        is_delete: DELETE_STATUS.DELETE,
        status: -10,
        update_time: Date.now()
      })
      .where('create_time', '<', expireTime)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return Number(result.numUpdatedRows)
  }

  /**
   * Check if cache exists by hash
   * @param hash Cache hash
   * @param excludeId Optional id to exclude
   * @returns true if exists
   */
  async checkCacheExists(hash: string, excludeId?: number): Promise<boolean> {
    let query = db
      .selectFrom('caches')
      .select('id')
      .where('hash', '=', hash)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    const cache = await query.executeTakeFirst()
    return !!cache
  }

  /**
   * Get cache statistics
   * @returns Statistics data
   */
  async getCacheStats(): Promise<{ total: number; active: number; expired: number }> {
    const [total, active, expired] = await Promise.all([
      db
        .selectFrom('caches')
        .select((eb) => [eb.fn.count('id').as('count')])
        .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
        .executeTakeFirst(),
      db
        .selectFrom('caches')
        .select((eb) => [eb.fn.count('id').as('count')])
        .where('status', '=', 10)
        .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
        .executeTakeFirst(),
      db
        .selectFrom('caches')
        .select((eb) => [eb.fn.count('id').as('count')])
        .where('status', '=', -10)
        .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
        .executeTakeFirst()
    ])

    return {
      total: Number(total?.count) || 0,
      active: Number(active?.count) || 0,
      expired: Number(expired?.count) || 0
    }
  }

  /**
   * Clear all caches
   * @returns Number of cleared caches
   */
  async clearAllCaches(): Promise<number> {
    const result = await db
      .updateTable('caches')
      .set({
        is_delete: DELETE_STATUS.DELETE,
        status: -10,
        update_time: Date.now()
      })
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return Number(result.numUpdatedRows)
  }
}

export const cacheService = new CacheService()
