import { db } from '@src/server/libs/db'

export interface CreateAttrData {
  title: string
  alias?: string
  sort?: number
  status?: number
}

export type UpdateAttrData = Partial<CreateAttrData>

export interface AttrFilters {
  title?: string
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

export class AttrService {
  /**
   * Get a single attribute by ID
   */
  async getAttrById(id: number) {
    return await db
      .selectFrom('attrs')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()
  }

  /**
   * Get attributes with pagination and filters
   */
  async getAttrs(
    filters: AttrFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResult<any>> {
    const { page, pageSize } = pagination
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('attrs').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (filters.title) {
      query = query.where('title', 'like', `%${filters.title}%`)
    }
    if (filters.status !== undefined && !isNaN(filters.status)) {
      query = query.where('status', '=', filters.status)
    }
    if (filters.start_time) {
      query = query.where('create_time', '>=', filters.start_time)
    }
    if (filters.end_time) {
      query = query.where('create_time', '<=', filters.end_time)
    }

    // Order by create_time desc by default
    query = query.orderBy('create_time', 'desc')

    const [attrs, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    return {
      dataList: attrs,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Create a new attribute
   */
  async createAttr(data: CreateAttrData) {
    const now = Date.now()
    const newAttr = {
      ...data,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.safeInsertInto('attrs').values(newAttr).executeTakeFirst()

    return {
      id: Number(result.insertId),
      ...newAttr
    }
  }

  /**
   * Update an attribute
   */
  async updateAttr(id: number, data: UpdateAttrData) {
    const updateData = {
      ...data,
      update_time: Date.now()
    }

    const result = await db
      .safeUpdateTable('attrs')
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
   * Delete an attribute (logical delete)
   */
  async deleteAttr(id: number) {
    const result = await db
      .safeUpdateTable('attrs')
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
   * Get attributes by status
   */
  async getAttrsByStatus(status: number, limit = 10) {
    return await db
      .selectFrom('attrs')
      .selectAll()
      .where('status', '=', status)
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get attributes by title (search)
   */
  async searchAttrsByTitle(title: string, limit = 10) {
    return await db
      .selectFrom('attrs')
      .selectAll()
      .where('title', 'like', `%${title}%`)
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get all active attributes
   */
  async getAllActiveAttrs() {
    return await db
      .selectFrom('attrs')
      .selectAll()
      .where('status', '=', 10)
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Check if attribute title already exists
   */
  async checkTitleExists(title: string, excludeId?: number) {
    let query = db
      .selectFrom('attrs')
      .select('id')
      .where('title', '=', title)
      .where('is_delete', '=', 0)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    return await query.executeTakeFirst()
  }

  /**
   * Get attributes by alias
   */
  async getAttrByAlias(alias: string) {
    return await db
      .selectFrom('attrs')
      .selectAll()
      .where('alias', '=', alias)
      .where('is_delete', '=', 0)
      .executeTakeFirst()
  }
}

export const attrService = new AttrService()
