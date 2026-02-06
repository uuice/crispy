import { db } from '@src/libs/db'
import { DELETE_STATUS } from '../config/const'
import {
  CreateEnum,
  createEnumSchema,
  CreateSuccess,
  EnumEntity,
  EnumFilters,
  PaginatedResult,
  PaginationOptions,
  UpdateEnum,
  updateEnumSchema,
  UpdateSuccess
} from '@src/types'

export class EnumService {
  /**
   * Get a single enum by ID
   * @param id Enum id
   * @returns Enum or null if not found
   */
  async getById(id: number): Promise<EnumEntity | null> {
    const enumItem = await db
      .selectFrom('enums')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return enumItem || null
  }

  /**
   * Get enums with pagination and filters
   * @param filters Filter options
   * @param options Pagination options
   * @returns List of enums and pagination info
   */
  async getEnums(filters: EnumFilters): Promise<PaginatedResult<EnumEntity>> {
    const { page = 1, pageSize = 10 } = filters
    const { title, alias, code, status } = filters
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('enums').selectAll()

    // Apply filters
    if (title) {
      query = query.where('title', 'like', `%${title}%`)
    }

    if (alias) {
      query = query.where('alias', 'like', `%${alias}%`)
    }

    if (code) {
      query = query.where('code', 'like', `%${code}%`)
    }

    if (status !== undefined) {
      query = query.where('status', '=', status)
    }

    // Default to only non-deleted enums
    query = query.where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    const [enums, total] = await Promise.all([
      query.orderBy('create_time', 'desc').limit(pageSize).offset(offset).execute(),
      db
        .selectFrom('enums')
        .select((eb) => [eb.fn.count('id').as('count')])
        .$call((qb) => {
          // Apply same filters to count query
          if (title) {
            qb = qb.where('title', 'like', `%${title}%`)
          }
          if (alias) {
            qb = qb.where('alias', 'like', `%${alias}%`)
          }
          if (code) {
            qb = qb.where('code', 'like', `%${code}%`)
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
   * @param createData Enum data without id
   * @returns Created enum id
   */
  async create(createData: CreateEnum): Promise<CreateSuccess> {
    // 验证
    const validatedData = createEnumSchema.parse(createData)
    const now = Date.now()
    const newEnum = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: DELETE_STATUS.UN_DELETE
    }

    const result = await db.insertInto('enums').values(newEnum).executeTakeFirst()
    if (!result) throw new Error('创建枚举失败')
    return { id: Number(result.insertId) }
  }

  /**
   * Update an enum
   * @param id Enum id
   * @param updateData Data to update
   * @returns Updated enum id
   */
  async update(id: number, updateData: UpdateEnum): Promise<UpdateSuccess> {
    const validatedData = updateEnumSchema.parse(updateData)
    const result = await db
      .updateTable('enums')
      .set({
        ...validatedData,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!result) throw new Error('更新枚举失败')
    return { id }
  }

  /**
   * Soft delete enum
   * @param id Enum id
   * @returns true if deleted successfully
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .updateTable('enums')
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
   * Get enums by code
   * @param code Enum code
   * @param limit Max number of results
   * @returns List of enums
   */
  async getEnumsByCode(code: string, limit = 10): Promise<EnumEntity[]> {
    return await db
      .selectFrom('enums')
      .selectAll()
      .where('code', '=', code)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get enums by status
   * @param status Enum status
   * @param limit Max number of results
   * @returns List of enums
   */
  async getEnumsByStatus(status: number, limit = 10): Promise<EnumEntity[]> {
    return await db
      .selectFrom('enums')
      .selectAll()
      .where('status', '=', status)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get enum by alias
   * @param alias Enum alias
   * @returns Enum or null if not found
   */
  async getEnumByAlias(alias: string): Promise<EnumEntity | null> {
    const enumItem = await db
      .selectFrom('enums')
      .selectAll()
      .where('alias', '=', alias)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return enumItem || null
  }

  /**
   * Check if enum title already exists
   * @param title Enum title
   * @param excludeId Enum id to exclude from check
   * @returns true if exists
   */
  async checkTitleExists(title: string, excludeId?: number): Promise<boolean> {
    let query = db
      .selectFrom('enums')
      .select('id')
      .where('title', '=', title)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    const result = await query.executeTakeFirst()
    return !!result
  }

  /**
   * Check if enum code already exists
   * @param code Enum code
   * @param excludeId Enum id to exclude from check
   * @returns true if exists
   */
  async checkCodeExists(code: string, excludeId?: number): Promise<boolean> {
    let query = db
      .selectFrom('enums')
      .select('id')
      .where('code', '=', code)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    const result = await query.executeTakeFirst()
    return !!result
  }

  /**
   * Get all active enums
   * @returns List of active enums
   */
  async getAllActiveEnums(): Promise<EnumEntity[]> {
    return await db
      .selectFrom('enums')
      .selectAll()
      .where('status', '=', 10)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Search enums by title
   * @param title Search keyword
   * @param limit Max number of results
   * @returns List of enums
   */
  async searchEnumsByTitle(title: string, limit = 10): Promise<EnumEntity[]> {
    return await db
      .selectFrom('enums')
      .selectAll()
      .where('title', 'like', `%${title}%`)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }
}

export const enumService = new EnumService()
