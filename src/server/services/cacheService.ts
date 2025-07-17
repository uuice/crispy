import { db } from '@src/libs/db'

export interface CreateCacheData {
  hash: string
  cache_data: string
  status?: number
}

export type UpdateCacheData = Partial<CreateCacheData>

export interface CacheFilters {
  hash?: string
  status?: number
  start_time?: number
  end_time?: number
}

export interface PaginationParams {
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

export class CacheService {
  /**
   * Get a single cache by ID
   */
  async getCacheById(id: number) {
    return await db
      .selectFrom('caches')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()
  }

  /**
   * Get caches with pagination and filters
   */
  async getCaches(
    filters: CacheFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResult<any>> {
    const { page, pageSize } = pagination
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('caches').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (filters.hash) {
      query = query.where('hash', 'like', `%${filters.hash}%`)
    }
    if (filters.status !== undefined && !isNaN(filters.status)) {
      query = query.where('status', '=', filters.status)
    }
    if (filters.start_time !== undefined) {
      query = query.where('create_time', '>=', filters.start_time)
    }
    if (filters.end_time !== undefined) {
      query = query.where('create_time', '<=', filters.end_time)
    }

    // Order by create_time desc by default
    query = query.orderBy('create_time', 'desc')

    const [caches, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
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
   */
  async createCache(data: CreateCacheData) {
    const now = Date.now()
    const newCache = {
      ...data,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.safeInsertInto('caches').values(newCache).executeTakeFirst()

    return {
      id: Number(result.insertId),
      ...newCache
    }
  }

  /**
   * Update a cache
   */
  async updateCache(id: number, data: UpdateCacheData) {
    const updateData = {
      ...data,
      update_time: Date.now()
    }

    const result = await db
      .safeUpdateTable('caches')
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
   * Delete a cache (logical delete)
   */
  async deleteCache(id: number) {
    const result = await db
      .safeUpdateTable('caches')
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
   * Get cache by hash
   */
  async getCacheByHash(hash: string) {
    return await db
      .selectFrom('caches')
      .selectAll()
      .where('hash', '=', hash)
      .where('is_delete', '=', 0)
      .executeTakeFirst()
  }

  /**
   * Get caches by status
   */
  async getCachesByStatus(status: number, limit = 10) {
    return await db
      .selectFrom('caches')
      .selectAll()
      .where('status', '=', status)
      .where('is_delete', '=', 0)
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Clear expired caches
   */
  async clearExpiredCaches(expireTime: number) {
    const result = await db
      .safeUpdateTable('caches')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('create_time', '<', expireTime)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return {
      success: result.numUpdatedRows > 0,
      numUpdatedRows: result.numUpdatedRows
    }
  }

  /**
   * Check if cache exists by hash
   */
  async checkCacheExists(hash: string, excludeId?: number) {
    let query = db
      .selectFrom('caches')
      .select('id')
      .where('hash', '=', hash)
      .where('is_delete', '=', 0)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    return await query.executeTakeFirst()
  }

  /**
   * Get cache statistics
   */
  async getCacheStats() {
    const [total, active, expired] = await Promise.all([
      db
        .selectFrom('caches')
        .select((eb) => [eb.fn.count('id').as('count')])
        .where('is_delete', '=', 0)
        .executeTakeFirst(),
      db
        .selectFrom('caches')
        .select((eb) => [eb.fn.count('id').as('count')])
        .where('status', '=', 10)
        .where('is_delete', '=', 0)
        .executeTakeFirst(),
      db
        .selectFrom('caches')
        .select((eb) => [eb.fn.count('id').as('count')])
        .where('status', '=', 20)
        .where('is_delete', '=', 0)
        .executeTakeFirst()
    ])

    return {
      total: Number(total?.count) || 0,
      active: Number(active?.count) || 0,
      expired: Number(expired?.count) || 0
    }
  }
}

export const cacheService = new CacheService()
