import { db } from '@src/libs/db'
import { DELETE_STATUS } from '../config/const'
import {
  CreateKeyword,
  createKeywordSchema,
  CreateSuccess,
  KeywordEntity,
  KeywordFilters,
  PaginatedResult,
  UpdateKeyword,
  updateKeywordSchema,
  UpdateSuccess
} from '@src/types'
import { sql } from 'kysely'

export class KeywordService {
  /**
   * Get single keyword by ID
   * @param id Keyword id
   * @returns Keyword or null if not found
   */
  async getById(id: number): Promise<KeywordEntity | null> {
    const keyword = await db
      .selectFrom('keywords')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return keyword || null
  }

  /**
   * Get keywords list with pagination and filters
   * @param filters Filter options
   * @param options Pagination options
   * @returns List of keywords and pagination info
   */
  async getKeywords(filters: KeywordFilters): Promise<PaginatedResult<KeywordEntity>> {
    const page = Number(filters.page) || 1
    const pageSize = Number(filters.pageSize) || 10
    const {
      title,
      alias,
      status,
      create_time_start,
      create_time_end,
      update_time_start,
      update_time_end
    } = filters
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('keywords').selectAll()

    // Apply filters
    if (title) {
      query = query.where('title', 'like', `%${title}%`)
    }

    if (alias) {
      query = query.where('alias', 'like', `%${alias}%`)
    }

    if (status !== undefined) {
      query = query.where('status', '=', status)
    }

    if (create_time_start !== undefined) {
      query = query.where('create_time', '>=', create_time_start)
    }

    if (create_time_end !== undefined) {
      query = query.where('create_time', '<=', create_time_end)
    }

    if (update_time_start !== undefined) {
      query = query.where('update_time', '>=', update_time_start)
    }

    if (update_time_end !== undefined) {
      query = query.where('update_time', '<=', update_time_end)
    }

    // Default to only non-deleted keywords
    query = query.where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    const [keywords, total] = await Promise.all([
      query.orderBy('create_time', 'desc').limit(pageSize).offset(offset).execute(),
      db
        .selectFrom('keywords')
        .select((eb) => [eb.fn.count('id').as('count')])
        .$call((qb) => {
          // Apply same filters to count query
          if (title) {
            qb = qb.where('title', 'like', `%${title}%`)
          }
          if (alias) {
            qb = qb.where('alias', 'like', `%${alias}%`)
          }
          if (status !== undefined) {
            qb = qb.where('status', '=', status)
          }
          if (create_time_start !== undefined) {
            qb = qb.where('create_time', '>=', create_time_start)
          }
          if (create_time_end !== undefined) {
            qb = qb.where('create_time', '<=', create_time_end)
          }
          if (update_time_start !== undefined) {
            qb = qb.where('update_time', '>=', update_time_start)
          }
          if (update_time_end !== undefined) {
            qb = qb.where('update_time', '<=', update_time_end)
          }
          qb = qb.where('is_delete', '=', DELETE_STATUS.UN_DELETE)
          return qb
        })
        .executeTakeFirst()
    ])

    return {
      dataList: keywords,
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
   * @param createData Keyword data without id
   * @returns Created keyword id
   */
  async create(createData: CreateKeyword): Promise<CreateSuccess> {
    // 验证
    const validatedData = createKeywordSchema.parse(createData)
    const now = Date.now()
    const newKeyword = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: DELETE_STATUS.UN_DELETE
    }

    const result = await db.insertInto('keywords').values(newKeyword).executeTakeFirst()
    if (!result) throw new Error('创建关键词失败')
    return { id: Number(result.insertId) }
  }

  /**
   * Update keyword by ID
   * @param id Keyword id
   * @param updateData Data to update
   * @returns Updated keyword id
   */
  async update(id: number, updateData: UpdateKeyword): Promise<UpdateSuccess> {
    const validatedData = updateKeywordSchema.parse(updateData)
    const result = await db
      .updateTable('keywords')
      .set({
        ...validatedData,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!result) throw new Error('更新关键词失败')
    return { id }
  }

  /**
   * Soft delete keyword
   * @param id Keyword id
   * @returns true if deleted successfully
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .updateTable('keywords')
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
   * Get keywords by status
   * @param status Keyword status
   * @returns List of keywords
   */
  async getKeywordsByStatus(status: number): Promise<KeywordEntity[]> {
    return await db
      .selectFrom('keywords')
      .selectAll()
      .where('status', '=', status)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Search keywords by title or alias
   * @param searchTerm Search term
   * @returns List of keywords
   */
  async searchKeywords(searchTerm: string): Promise<KeywordEntity[]> {
    return await db
      .selectFrom('keywords')
      .selectAll()
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .where((eb) =>
        eb.or([eb('title', 'like', `%${searchTerm}%`), eb('alias', 'like', `%${searchTerm}%`)])
      )
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Get keywords count by status
   * @returns Count by status
   */
  async getKeywordsCountByStatus(): Promise<{ status: number; count: number }[]> {
    return await db
      .selectFrom('keywords')
      .select(['status', sql<number>`count(*)`.as('count')])
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .groupBy('status')
      .execute()
  }

  /**
   * Check if keyword exists by alias
   * @param alias Keyword alias
   * @param excludeId Keyword id to exclude from check
   * @returns true if exists
   */
  async checkKeywordExistsByAlias(alias: string, excludeId?: number): Promise<boolean> {
    let query = db
      .selectFrom('keywords')
      .select('id')
      .where('alias', '=', alias)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)

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
