import { db } from '@src/libs/db'
import { sql } from 'kysely'

// Data interfaces
export interface CreateKeywordData {
  title: string
  alias: string
  value?: string
  url?: string
  type_id?: number
  status: number
}

export type UpdateKeywordData = Partial<CreateKeywordData>

export interface KeywordFilters {
  title?: string
  alias?: string
  status?: number
  startTime?: number
  endTime?: number
}

export interface KeywordPaginationParams {
  page: number
  pageSize: number
}

export interface Keyword {
  id: number
  title: string
  alias: string
  value?: string
  url?: string
  type_id?: number
  status: number
  create_time: number
  update_time: number
  is_delete: number
}

export interface PaginatedKeywordsResult {
  dataList: Keyword[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export class KeywordService {
  /**
   * Get single keyword by ID
   */
  async getKeywordById(id: number): Promise<Keyword | null> {
    const result = await db
      .selectFrom('keywords')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return result as Keyword | null
  }

  /**
   * Get keywords list with pagination and filters
   */
  async getKeywords(
    pagination: KeywordPaginationParams,
    filters?: KeywordFilters
  ): Promise<PaginatedKeywordsResult> {
    const { page, pageSize } = pagination
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('keywords').selectAll().where('is_delete', '=', 0)

    // Apply filters
    if (filters) {
      if (filters.title) {
        query = query.where('title', 'like', `%${filters.title}%`)
      }
      if (filters.alias) {
        query = query.where('alias', 'like', `%${filters.alias}%`)
      }
      if (filters.status !== undefined) {
        query = query.where('status', '=', filters.status)
      }
      if (filters.startTime !== undefined) {
        query = query.where('create_time', '>=', filters.startTime)
      }
      if (filters.endTime !== undefined) {
        query = query.where('create_time', '<=', filters.endTime)
      }
    }

    // Order by create_time desc by default
    query = query.orderBy('create_time', 'desc')

    const [keywords, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    return {
      dataList: keywords as Keyword[],
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Create new keyword
   */
  async createKeyword(data: CreateKeywordData): Promise<Keyword> {
    const now = Date.now()
    const newKeyword = {
      ...data,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.safeInsertInto('keywords').values(newKeyword).executeTakeFirst()

    return {
      id: Number(result.insertId),
      ...newKeyword
    }
  }

  /**
   * Update keyword by ID
   */
  async updateKeyword(id: number, data: UpdateKeywordData): Promise<boolean> {
    const updateData = {
      ...data,
      update_time: Date.now()
    }

    const result = await db
      .safeUpdateTable('keywords')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return result.numUpdatedRows > 0n
  }

  /**
   * Delete keyword (logical delete)
   */
  async deleteKeyword(id: number): Promise<boolean> {
    const result = await db
      .safeUpdateTable('keywords')
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
   * Get keywords by status
   */
  async getKeywordsByStatus(status: number): Promise<Keyword[]> {
    const result = await db
      .selectFrom('keywords')
      .selectAll()
      .where('status', '=', status)
      .where('is_delete', '=', 0)
      .orderBy('create_time', 'desc')
      .execute()

    return result as Keyword[]
  }

  /**
   * Search keywords by title or alias
   */
  async searchKeywords(searchTerm: string): Promise<Keyword[]> {
    const result = await db
      .selectFrom('keywords')
      .selectAll()
      .where('is_delete', '=', 0)
      .where((eb) =>
        eb.or([eb('title', 'like', `%${searchTerm}%`), eb('alias', 'like', `%${searchTerm}%`)])
      )
      .orderBy('create_time', 'desc')
      .execute()

    return result as Keyword[]
  }

  /**
   * Get keywords count by status
   */
  async getKeywordsCountByStatus(): Promise<{ status: number; count: number }[]> {
    return await db
      .selectFrom('keywords')
      .select(['status', sql<number>`count(*)`.as('count')])
      .where('is_delete', '=', 0)
      .groupBy('status')
      .execute()
  }

  /**
   * Check if keyword exists by alias
   */
  async checkKeywordExistsByAlias(alias: string, excludeId?: number): Promise<boolean> {
    let query = db
      .selectFrom('keywords')
      .select('id')
      .where('alias', '=', alias)
      .where('is_delete', '=', 0)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    const result = await query.executeTakeFirst()
    return !!result
  }

  /**
   * Get keywords statistics
   */
  async getKeywordsStats(): Promise<{
    total: number
    active: number
    inactive: number
    deleted: number
  }> {
    const stats = await db
      .selectFrom('keywords')
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
export const keywordService = new KeywordService()
