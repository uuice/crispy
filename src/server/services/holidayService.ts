import { db } from '@src/libs/db'
import { DELETE_STATUS } from '../config/const'
import {
  CreateHoliday,
  createHolidaySchema,
  CreateSuccess,
  HolidayEntity,
  HolidayFilters,
  PaginatedResult,
  PaginationOptions,
  UpdateHoliday,
  updateHolidaySchema,
  UpdateSuccess
} from '@src/types'

export class HolidayService {
  /**
   * Get a single holiday by ID
   * @param id Holiday id
   * @returns Holiday or null if not found
   */
  async getById(id: number): Promise<HolidayEntity | null> {
    const holiday = await db
      .selectFrom('holidays')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return holiday || null
  }

  /**
   * Get holidays with pagination and filters
   * @param filters Filter options
   * @param options Pagination options
   * @returns List of holidays and pagination info
   */
  async getHolidays(filters: HolidayFilters): Promise<PaginatedResult<HolidayEntity>> {
    const { page = 1, pageSize = 10 } = filters
    const { title, value } = filters
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('holidays').selectAll()

    // Apply filters
    if (title) {
      query = query.where('title', 'like', `%${title}%`)
    }

    if (value) {
      query = query.where('value', 'like', `%${value}%`)
    }

    // Default to only non-deleted holidays
    query = query.where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    const [holidays, total] = await Promise.all([
      query
        .orderBy('sort', 'asc')
        .orderBy('create_time', 'desc')
        .limit(pageSize)
        .offset(offset)
        .execute(),
      db
        .selectFrom('holidays')
        .select((eb) => [eb.fn.count('id').as('count')])
        .$call((qb) => {
          // Apply same filters to count query
          if (title) {
            qb = qb.where('title', 'like', `%${title}%`)
          }
          if (value) {
            qb = qb.where('value', 'like', `%${value}%`)
          }
          qb = qb.where('is_delete', '=', DELETE_STATUS.UN_DELETE)
          return qb
        })
        .executeTakeFirst()
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
   * @param createData Holiday data without id
   * @returns Created holiday id
   */
  async create(createData: CreateHoliday): Promise<CreateSuccess> {
    // 验证
    const validatedData = createHolidaySchema.parse(createData)
    const now = Date.now()
    const newHoliday = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: DELETE_STATUS.UN_DELETE
    }

    const result = await db.insertInto('holidays').values(newHoliday).executeTakeFirst()
    if (!result) throw new Error('创建节假日失败')
    return { id: Number(result.insertId) }
  }

  /**
   * Update a holiday
   * @param id Holiday id
   * @param updateData Data to update
   * @returns Updated holiday id
   */
  async update(id: number, updateData: UpdateHoliday): Promise<UpdateSuccess> {
    const validatedData = updateHolidaySchema.parse(updateData)
    const result = await db
      .updateTable('holidays')
      .set({
        ...validatedData,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!result) throw new Error('更新节假日失败')
    return { id }
  }

  /**
   * Soft delete holiday
   * @param id Holiday id
   * @returns true if deleted successfully
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .updateTable('holidays')
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
   * Get holiday by name
   * @param title Holiday name
   * @returns Holiday or null if not found
   */
  async getHolidayByName(title: string): Promise<HolidayEntity | null> {
    const holiday = await db
      .selectFrom('holidays')
      .selectAll()
      .where('title', '=', title)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return holiday || null
  }

  /**
   * Get holiday by value
   * @param value Holiday value
   * @returns Holiday or null if not found
   */
  async getHolidayByValue(value: string): Promise<HolidayEntity | null> {
    const holiday = await db
      .selectFrom('holidays')
      .selectAll()
      .where('value', '=', value)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return holiday || null
  }

  /**
   * Search holidays by name
   * @param title Search keyword
   * @param limit Max number of results
   * @returns List of holidays
   */
  async searchHolidaysByName(title: string, limit = 10): Promise<HolidayEntity[]> {
    return await db
      .selectFrom('holidays')
      .selectAll()
      .where('title', 'like', `%${title}%`)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get all holidays ordered by sort
   * @returns List of all holidays
   */
  async getAllHolidays(): Promise<HolidayEntity[]> {
    return await db
      .selectFrom('holidays')
      .selectAll()
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Check if holiday name already exists
   * @param title Holiday name
   * @param excludeId Holiday id to exclude from check
   * @returns true if exists
   */
  async checkNameExists(title: string, excludeId?: number): Promise<boolean> {
    let query = db
      .selectFrom('holidays')
      .select('id')
      .where('title', '=', title)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    const holiday = await query.executeTakeFirst()
    return !!holiday
  }

  /**
   * Check if holiday value already exists
   * @param value Holiday value
   * @param excludeId Holiday id to exclude from check
   * @returns true if exists
   */
  async checkValueExists(value: string, excludeId?: number): Promise<boolean> {
    let query = db
      .selectFrom('holidays')
      .select('id')
      .where('value', '=', value)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    const holiday = await query.executeTakeFirst()
    return !!holiday
  }
}

export const holidayService = new HolidayService()
