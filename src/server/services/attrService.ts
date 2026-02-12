import { db } from '@src/libs/db'
import { DELETE_STATUS } from '../config/const'
import {
  AttrEntity,
  AttrFilters,
  CreateAttr,
  createAttrSchema,
  CreateSuccess,
  PaginatedResult,
  UpdateAttr,
  updateAttrSchema,
  UpdateSuccess
} from '@src/types'

export class AttrService {
  /**
   * Get a single attribute by ID
   * @param id Attribute id
   * @returns Attribute or null if not found
   */
  async getById(id: number): Promise<AttrEntity | null> {
    const attr = await db
      .selectFrom('attrs')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return attr || null
  }

  /**
   * Get attributes with pagination and filters
   * @param filters Filter options
   * @param options Pagination options
   * @returns List of attributes and pagination info
   */
  async getAttrs(filters: AttrFilters): Promise<PaginatedResult<AttrEntity>> {
    const page = Number(filters.page) || 1
    const pageSize = Number(filters.pageSize) || 10
    const {
      id,
      title,
      alias,
      status,
      sort,
      create_time_start,
      create_time_end,
      update_time_start,
      update_time_end
    } = filters
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('attrs').selectAll()

    // Apply filters
    if (id !== undefined) {
      query = query.where('id', '=', id)
    }

    if (title) {
      query = query.where('title', 'like', `%${title}%`)
    }

    if (alias) {
      query = query.where('alias', 'like', `%${alias}%`)
    }

    if (status !== undefined) {
      query = query.where('status', '=', status)
    }

    if (sort !== undefined) {
      query = query.where('sort', '=', sort)
    }

    // 时间范围过滤
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

    // Default to only non-deleted attributes
    query = query.where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    const [attrs, total] = await Promise.all([
      query
        .orderBy('sort', 'asc')
        .orderBy('create_time', 'desc')
        .limit(pageSize)
        .offset(offset)
        .execute(),
      db
        .selectFrom('attrs')
        .select((eb) => [eb.fn.count('id').as('count')])
        .$call((qb) => {
          // Apply same filters to count query
          if (id !== undefined) {
            qb = qb.where('id', '=', id)
          }
          if (title) {
            qb = qb.where('title', 'like', `%${title}%`)
          }
          if (alias) {
            qb = qb.where('alias', 'like', `%${alias}%`)
          }
          if (status !== undefined) {
            qb = qb.where('status', '=', status)
          }
          if (sort !== undefined) {
            qb = qb.where('sort', '=', sort)
          }
          // 时间范围过滤
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
   * @param createData Attribute data without id
   * @returns Created attribute id
   */
  async create(createData: CreateAttr): Promise<CreateSuccess> {
    // 验证
    const validatedData = createAttrSchema.parse(createData)
    const now = Date.now()
    const newAttr = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: DELETE_STATUS.UN_DELETE
    }

    const result = await db.insertInto('attrs').values(newAttr).executeTakeFirst()
    if (!result) throw new Error('创建属性失败')
    return { id: Number(result.insertId) }
  }

  /**
   * Update an attribute
   * @param id Attribute id
   * @param updateData Data to update
   * @returns Updated attribute id
   */
  async update(id: number, updateData: UpdateAttr): Promise<UpdateSuccess> {
    const validatedData = updateAttrSchema.parse(updateData)
    const result = await db
      .updateTable('attrs')
      .set({
        ...validatedData,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!result) throw new Error('更新属性失败')
    return { id }
  }

  /**
   * Soft delete attribute
   * @param id Attribute id
   * @returns true if deleted successfully
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .updateTable('attrs')
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
   * Get attributes by status
   * @param status Attribute status
   * @param limit Max number of results
   * @returns List of attributes
   */
  async getAttrsByStatus(status: number, limit = 10): Promise<AttrEntity[]> {
    return await db
      .selectFrom('attrs')
      .selectAll()
      .where('status', '=', status)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Search attributes by title
   * @param title Search keyword
   * @param limit Max number of results
   * @returns List of attributes
   */
  async searchAttrsByTitle(title: string, limit = 10): Promise<AttrEntity[]> {
    return await db
      .selectFrom('attrs')
      .selectAll()
      .where('title', 'like', `%${title}%`)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get all active attributes
   * @returns List of active attributes
   */
  async getAllActiveAttrs(): Promise<AttrEntity[]> {
    return await db
      .selectFrom('attrs')
      .selectAll()
      .where('status', '=', 10)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Check if attribute title already exists
   * @param title Attribute title
   * @param excludeId Attribute id to exclude from check
   * @returns true if exists
   */
  async checkTitleExists(title: string, excludeId?: number): Promise<boolean> {
    let query = db
      .selectFrom('attrs')
      .select('id')
      .where('title', '=', title)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    const attr = await query.executeTakeFirst()
    return !!attr
  }

  /**
   * Get attribute by alias
   * @param alias Attribute alias
   * @returns Attribute or null if not found
   */
  async getAttrByAlias(alias: string): Promise<AttrEntity | null> {
    const attr = await db
      .selectFrom('attrs')
      .selectAll()
      .where('alias', '=', alias)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return attr || null
  }
}

export const attrService = new AttrService()
