import { db } from '@src/libs/db'

export interface CreateConfigData {
  title: string
  alias?: string
  value: string
  type_id?: number
  type_ids?: string
  sort?: number
  status?: number
}

export type UpdateConfigData = Partial<CreateConfigData>

export interface ConfigFilters {
  title?: string
  alias?: string
  type_id?: number
  status?: number
  start_time?: number
  end_time?: number
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export class ConfigService {
  /**
   * Get a single config by ID
   */
  async getConfigById(id: number) {
    return await db
      .selectFrom('configs')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()
  }

  /**
   * Get configs with pagination and filters
   */
  async getConfigs(
    filters: ConfigFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResult<any>> {
    const { page, pageSize } = pagination
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('configs').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (filters.title) {
      query = query.where('title', 'like', `%${filters.title}%`)
    }
    if (filters.alias) {
      query = query.where('alias', 'like', `%${filters.alias}%`)
    }
    if (filters.type_id !== undefined && !isNaN(filters.type_id)) {
      query = query.where('type_id', '=', filters.type_id)
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

    const [configs, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    return {
      data: configs,
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
   */
  async createConfig(data: CreateConfigData) {
    const now = Date.now()
    const newConfig = {
      ...data,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.safeInsertInto('configs').values(newConfig).executeTakeFirst()

    return {
      id: Number(result.insertId),
      ...newConfig
    }
  }

  /**
   * Update a config
   */
  async updateConfig(id: number, data: UpdateConfigData) {
    const updateData = {
      ...data,
      update_time: Date.now()
    }

    const result = await db
      .safeUpdateTable('configs')
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
   * Delete a config (logical delete)
   */
  async deleteConfig(id: number) {
    const result = await db
      .safeUpdateTable('configs')
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
   * Get config by alias
   */
  async getConfigByAlias(alias: string) {
    return await db
      .selectFrom('configs')
      .selectAll()
      .where('alias', '=', alias)
      .where('is_delete', '=', 0)
      .executeTakeFirst()
  }

  /**
   * Get configs by type ID
   */
  async getConfigsByType(typeId: number, limit = 10) {
    return await db
      .selectFrom('configs')
      .selectAll()
      .where('type_id', '=', typeId)
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get configs by status
   */
  async getConfigsByStatus(status: number, limit = 10) {
    return await db
      .selectFrom('configs')
      .selectAll()
      .where('status', '=', status)
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get all active configs
   */
  async getAllActiveConfigs() {
    return await db
      .selectFrom('configs')
      .selectAll()
      .where('status', '=', 10)
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Check if config title already exists
   */
  async checkTitleExists(title: string, excludeId?: number) {
    let query = db
      .selectFrom('configs')
      .select('id')
      .where('title', '=', title)
      .where('is_delete', '=', 0)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    return await query.executeTakeFirst()
  }

  /**
   * Check if config alias already exists
   */
  async checkAliasExists(alias: string, excludeId?: number) {
    let query = db
      .selectFrom('configs')
      .select('id')
      .where('alias', '=', alias)
      .where('is_delete', '=', 0)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    return await query.executeTakeFirst()
  }

  /**
   * Get configs by title (search)
   */
  async searchConfigsByTitle(title: string, limit = 10) {
    return await db
      .selectFrom('configs')
      .selectAll()
      .where('title', 'like', `%${title}%`)
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get configs by multiple type IDs
   */
  async getConfigsByTypeIds(typeIds: string, limit = 10) {
    return await db
      .selectFrom('configs')
      .selectAll()
      .where('type_ids', 'like', `%${typeIds}%`)
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get config statistics
   */
  async getConfigStats() {
    const [total, active, byType] = await Promise.all([
      db
        .selectFrom('configs')
        .select((eb) => [eb.fn.count('id').as('count')])
        .where('is_delete', '=', 0)
        .executeTakeFirst(),
      db
        .selectFrom('configs')
        .select((eb) => [eb.fn.count('id').as('count')])
        .where('status', '=', 10)
        .where('is_delete', '=', 0)
        .executeTakeFirst(),
      db
        .selectFrom('configs')
        .select((eb) => [eb.fn.count('id').as('count')])
        .where('type_id', 'is not', null)
        .where('is_delete', '=', 0)
        .executeTakeFirst()
    ])

    return {
      total: Number(total?.count) || 0,
      active: Number(active?.count) || 0,
      withType: Number(byType?.count) || 0
    }
  }
}

export const configService = new ConfigService()
