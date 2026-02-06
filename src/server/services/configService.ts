import { db } from '@src/libs/db'
import { DELETE_STATUS } from '../config/const'
import {
  ConfigEntity,
  ConfigFilters,
  CreateConfig,
  createConfigSchema,
  CreateSuccess,
  PaginatedResult,
  PaginationOptions,
  UpdateConfig,
  updateConfigSchema,
  UpdateSuccess
} from '@src/types'

export class ConfigService {
  /**
   * Get a single config by ID
   * @param id Config id
   * @returns Config or null if not found
   */
  async getById(id: number): Promise<ConfigEntity | null> {
    const config = await db
      .selectFrom('configs')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return config || null
  }

  /**
   * Get configs with pagination and filters
   * @param filters Filter options
   * @param options Pagination options
   * @returns List of configs and pagination info
   */
  async getConfigs(filters: ConfigFilters): Promise<PaginatedResult<ConfigEntity>> {
    const page = Number(filters.page) || 1
    const pageSize = Number(filters.pageSize) || 10
    const { title, alias, type_id, status } = filters
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('configs').selectAll()

    // Apply filters
    if (title) {
      query = query.where('title', 'like', `%${title}%`)
    }

    if (alias) {
      query = query.where('alias', 'like', `%${alias}%`)
    }

    if (type_id !== undefined) {
      query = query.where('type_id', '=', type_id)
    }

    if (status !== undefined) {
      query = query.where('status', '=', status)
    }

    // Default to only non-deleted configs
    query = query.where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    const [configs, total] = await Promise.all([
      query.orderBy('create_time', 'desc').limit(pageSize).offset(offset).execute(),
      db
        .selectFrom('configs')
        .select((eb) => [eb.fn.count('id').as('count')])
        .$call((qb) => {
          // Apply same filters to count query
          if (title) {
            qb = qb.where('title', 'like', `%${title}%`)
          }
          if (alias) {
            qb = qb.where('alias', 'like', `%${alias}%`)
          }
          if (type_id !== undefined) {
            qb = qb.where('type_id', '=', type_id)
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
      dataList: configs,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Create a new config
   * @param createData Config data without id
   * @returns Created config id
   */
  async create(createData: CreateConfig): Promise<CreateSuccess> {
    // 验证
    const validatedData = createConfigSchema.parse(createData)
    const now = Date.now()
    const newConfig = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: DELETE_STATUS.UN_DELETE
    }

    const result = await db.insertInto('configs').values(newConfig).executeTakeFirst()
    if (!result) throw new Error('创建配置失败')
    return { id: Number(result.insertId) }
  }

  /**
   * Update a config
   * @param id Config id
   * @param updateData Data to update
   * @returns Updated config id
   */
  async update(id: number, updateData: UpdateConfig): Promise<UpdateSuccess> {
    const validatedData = updateConfigSchema.parse(updateData)
    const result = await db
      .updateTable('configs')
      .set({
        ...validatedData,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!result) throw new Error('更新配置失败')
    return { id }
  }

  /**
   * Upsert a config by alias (insert if not exists, update if exists)
   * @param createData Config data
   * @returns Created/updated config info
   */
  async upsertConfigByAlias(createData: CreateConfig) {
    const now = Date.now()
    const existingConfig = await this.getConfigByAlias(createData.alias || '')

    if (existingConfig) {
      // Update existing config
      await db
        .updateTable('configs')
        .set({
          ...createData,
          update_time: now
        })
        .where('id', '=', existingConfig.id)
        .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
        .executeTakeFirst()

      return {
        id: existingConfig.id,
        ...createData,
        create_time: existingConfig.create_time,
        update_time: now,
        isUpdated: true
      }
    } else {
      // Create new config
      const newConfig = {
        ...createData,
        create_time: now,
        update_time: now,
        is_delete: DELETE_STATUS.UN_DELETE
      }

      const result = await db.insertInto('configs').values(newConfig).executeTakeFirst()

      return {
        id: Number(result.insertId),
        ...newConfig,
        isUpdated: false
      }
    }
  }

  /**
   * Soft delete config
   * @param id Config id
   * @returns true if deleted successfully
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .updateTable('configs')
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
   * Get config by alias
   * @param alias Config alias
   * @returns Config or null if not found
   */
  async getConfigByAlias(alias: string): Promise<ConfigEntity | null> {
    const config = await db
      .selectFrom('configs')
      .selectAll()
      .where('alias', '=', alias)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return config || null
  }

  /**
   * Get configs by type ID
   * @param typeId Type id
   * @param limit Max number of results
   * @returns List of configs
   */
  async getConfigsByType(typeId: number, limit = 10): Promise<ConfigEntity[]> {
    return await db
      .selectFrom('configs')
      .selectAll()
      .where('type_id', '=', typeId)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get configs by status
   * @param status Config status
   * @param limit Max number of results
   * @returns List of configs
   */
  async getConfigsByStatus(status: number, limit = 10): Promise<ConfigEntity[]> {
    return await db
      .selectFrom('configs')
      .selectAll()
      .where('status', '=', status)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get all active configs
   * @returns List of active configs
   */
  async getAllActiveConfigs(): Promise<ConfigEntity[]> {
    return await db
      .selectFrom('configs')
      .selectAll()
      .where('status', '=', 10)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Check if config title already exists
   * @param title Config title
   * @param excludeId Config id to exclude from check
   * @returns true if exists
   */
  async checkTitleExists(title: string, excludeId?: number): Promise<boolean> {
    let query = db
      .selectFrom('configs')
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
   * Check if config alias already exists
   * @param alias Config alias
   * @param excludeId Config id to exclude from check
   * @returns true if exists
   */
  async checkAliasExists(alias: string, excludeId?: number): Promise<boolean> {
    let query = db
      .selectFrom('configs')
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
   * Search configs by title
   * @param title Search keyword
   * @param limit Max number of results
   * @returns List of configs
   */
  async searchConfigsByTitle(title: string, limit = 10): Promise<ConfigEntity[]> {
    return await db
      .selectFrom('configs')
      .selectAll()
      .where('title', 'like', `%${title}%`)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get configs by multiple type IDs
   * @param typeIds Type IDs string
   * @param limit Max number of results
   * @returns List of configs
   */
  async getConfigsByTypeIds(typeIds: string, limit = 10): Promise<ConfigEntity[]> {
    return await db
      .selectFrom('configs')
      .selectAll()
      .where('type_ids', 'like', `%${typeIds}%`)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }
}

export const configService = new ConfigService()
