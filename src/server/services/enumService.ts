import { db } from '@src/libs/db'

export interface CreateEnumData {
  title: string
  alias?: string
  code: string
  value: string
  sort?: number
  status?: number
}

export type UpdateEnumData = Partial<CreateEnumData>

export interface EnumFilters {
  title?: string
  alias?: string
  code?: string
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

export class EnumService {
  /**
   * Get a single enum by ID
   */
  async getEnumById(id: number) {
    return await db
      .selectFrom('enums')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()
  }

  /**
   * Get enums with pagination and filters
   */
  async getEnums(
    filters: EnumFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResult<any>> {
    const { page, pageSize } = pagination
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('enums').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (filters.title) {
      query = query.where('title', 'like', `%${filters.title}%`)
    }
    if (filters.alias) {
      query = query.where('alias', 'like', `%${filters.alias}%`)
    }
    if (filters.code) {
      query = query.where('code', 'like', `%${filters.code}%`)
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

    const [enums, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    return {
      dataList: enums,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Create a new enum
   */
  async createEnum(data: CreateEnumData) {
    const now = Date.now()
    const newEnum = {
      ...data,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.safeInsertInto('enums').values(newEnum).executeTakeFirst()

    return {
      id: Number(result.insertId),
      ...newEnum
    }
  }

  /**
   * Update an enum
   */
  async updateEnum(id: number, data: UpdateEnumData) {
    const updateData = {
      ...data,
      update_time: Date.now()
    }

    const result = await db
      .safeUpdateTable('enums')
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
   * Delete an enum (logical delete)
   */
  async deleteEnum(id: number) {
    const result = await db
      .safeUpdateTable('enums')
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
   * Get enums by code
   */
  async getEnumsByCode(code: string, limit = 10) {
    return await db
      .selectFrom('enums')
      .selectAll()
      .where('code', '=', code)
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get enums by status
   */
  async getEnumsByStatus(status: number, limit = 10) {
    return await db
      .selectFrom('enums')
      .selectAll()
      .where('status', '=', status)
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get enum by alias
   */
  async getEnumByAlias(alias: string) {
    return await db
      .selectFrom('enums')
      .selectAll()
      .where('alias', '=', alias)
      .where('is_delete', '=', 0)
      .executeTakeFirst()
  }

  /**
   * Check if enum title already exists
   */
  async checkTitleExists(title: string, excludeId?: number) {
    let query = db
      .selectFrom('enums')
      .select('id')
      .where('title', '=', title)
      .where('is_delete', '=', 0)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    return await query.executeTakeFirst()
  }

  /**
   * Check if enum code already exists
   */
  async checkCodeExists(code: string, excludeId?: number) {
    let query = db
      .selectFrom('enums')
      .select('id')
      .where('code', '=', code)
      .where('is_delete', '=', 0)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    return await query.executeTakeFirst()
  }

  /**
   * Get all active enums
   */
  async getAllActiveEnums() {
    return await db
      .selectFrom('enums')
      .selectAll()
      .where('status', '=', 10)
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Get enums by title (search)
   */
  async searchEnumsByTitle(title: string, limit = 10) {
    return await db
      .selectFrom('enums')
      .selectAll()
      .where('title', 'like', `%${title}%`)
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }
}

export const enumService = new EnumService()
