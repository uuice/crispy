import { db } from '@src/server/libs/db'

export interface CreateHolidayData {
  title: string
  value: string
  sort?: number
}

export type UpdateHolidayData = Partial<CreateHolidayData>

export interface HolidayFilters {
  title?: string
  value?: string
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

export class HolidayService {
  /**
   * Get a single holiday by ID
   */
  async getHolidayById(id: number) {
    return await db
      .selectFrom('holidays')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()
  }

  /**
   * Get holidays with pagination and filters
   */
  async getHolidays(
    filters: HolidayFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResult<any>> {
    const { page, pageSize } = pagination
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('holidays').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (filters.title) {
      query = query.where('title', 'like', `%${filters.title}%`)
    }
    if (filters.value) {
      query = query.where('value', 'like', `%${filters.value}%`)
    }
    if (filters.start_time) {
      query = query.where('create_time', '>=', filters.start_time)
    }
    if (filters.end_time) {
      query = query.where('create_time', '<=', filters.end_time)
    }

    // Order by create_time desc by default
    query = query.orderBy('create_time', 'desc')

    const [holidays, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    return {
      dataList: holidays,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Create a new holiday
   */
  async createHoliday(data: CreateHolidayData) {
    const now = Date.now()
    const newHoliday = {
      ...data,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.safeInsertInto('holidays').values(newHoliday).executeTakeFirst()

    return {
      id: Number(result.insertId),
      ...newHoliday
    }
  }

  /**
   * Update a holiday
   */
  async updateHoliday(id: number, data: UpdateHolidayData) {
    const updateData = {
      ...data,
      update_time: Date.now()
    }

    const result = await db
      .safeUpdateTable('holidays')
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
   * Delete a holiday (logical delete)
   */
  async deleteHoliday(id: number) {
    const result = await db
      .safeUpdateTable('holidays')
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
   * Get holiday by name
   */
  async getHolidayByName(title: string) {
    return await db
      .selectFrom('holidays')
      .selectAll()
      .where('title', '=', title)
      .where('is_delete', '=', 0)
      .executeTakeFirst()
  }

  /**
   * Get holiday by value
   */
  async getHolidayByValue(value: string) {
    return await db
      .selectFrom('holidays')
      .selectAll()
      .where('value', '=', value)
      .where('is_delete', '=', 0)
      .executeTakeFirst()
  }

  /**
   * Get holidays by name (search)
   */
  async searchHolidaysByName(title: string, limit = 10) {
    return await db
      .selectFrom('holidays')
      .selectAll()
      .where('title', 'like', `%${title}%`)
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get all holidays ordered by sort
   */
  async getAllHolidays() {
    return await db
      .selectFrom('holidays')
      .selectAll()
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Check if holiday name already exists
   */
  async checkNameExists(title: string, excludeId?: number) {
    let query = db
      .selectFrom('holidays')
      .select('id')
      .where('title', '=', title)
      .where('is_delete', '=', 0)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    return await query.executeTakeFirst()
  }

  /**
   * Check if holiday value already exists
   */
  async checkValueExists(value: string, excludeId?: number) {
    let query = db
      .selectFrom('holidays')
      .select('id')
      .where('value', '=', value)
      .where('is_delete', '=', 0)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    return await query.executeTakeFirst()
  }
}

export const holidayService = new HolidayService()
