import { db } from '@src/libs/db'
import { z } from 'zod'
import { sql } from 'kysely'

// Validation schemas
const createAdditionSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  type: z.number().default(1), // 1: 必选, 2: 可选
  status: z.number().default(10),
  sort: z.number().default(0)
})

const updateAdditionSchema = createAdditionSchema.partial()

// Types
export interface CreateAdditionData {
  name: string
  description?: string
  price: number
  type?: number
  status?: number
  sort?: number
}

export type UpdateAdditionData = Partial<CreateAdditionData>

export interface PaginationOptions {
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

export interface AdditionFilters {
  type?: number
  status?: number
  is_delete?: number
  update_time?: number
  create_time?: number
}

// Addition Service Class
export class AdditionService {
  /**
   * Get a single addition by ID
   */
  async getAdditionById(id: number): Promise<any> {
    const addition = await db
      .selectFrom('additions')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!addition) {
      throw new Error('Addition not found')
    }

    return addition
  }

  /**
   * Get additions list with pagination and filters
   */
  async getAdditions(
    options: PaginationOptions,
    filters?: AdditionFilters
  ): Promise<PaginatedResult<any>> {
    const { page, pageSize } = options
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('additions').selectAll().where('is_delete', '=', 0)

    // Add type filter if provided
    if (filters?.type) {
      query = query.where(sql.ref('type'), '=', filters.type)
    }

    const [additions, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    return {
      dataList: additions,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Create a new addition
   */
  async createAddition(additionData: CreateAdditionData): Promise<any> {
    // Validate input data
    const validatedData = createAdditionSchema.parse(additionData)

    const now = Date.now()
    const newAddition = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: 0,
      fields_json: '{}' // Add default empty JSON object
    }

    const result = await db.safeInsertInto('additions').values(newAddition).executeTakeFirst()

    return {
      id: Number(result.insertId),
      ...newAddition
    }
  }

  /**
   * Update an existing addition
   */
  async updateAddition(id: number, additionData: UpdateAdditionData): Promise<any> {
    // Validate input data
    const validatedData = updateAdditionSchema.parse(additionData)

    const updateData = {
      ...validatedData,
      update_time: Date.now()
    }

    const result = await db
      .safeUpdateTable('additions')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      throw new Error('Addition not found')
    }

    return { id, ...updateData }
  }

  /**
   * Delete an addition (logical delete)
   */
  async deleteAddition(id: number): Promise<void> {
    const result = await db
      .safeUpdateTable('additions')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      throw new Error('Addition not found')
    }
  }

  /**
   * Get additions by type
   */
  async getAdditionsByType(type: number): Promise<any[]> {
    return await db
      .selectFrom('additions')
      .selectAll()
      .where(sql.ref('type'), '=', type)
      .where('is_delete', '=', 0)
      .where('status', '=', 10)
      .orderBy(sql.ref('sort'), 'asc')
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Check if addition exists by name
   */
  async additionExistsByName(name: string): Promise<boolean> {
    const addition = await db
      .selectFrom('additions')
      .select(['id'])
      .where(sql.ref('name'), '=', name)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return !!addition
  }

  /**
   * Get required additions (type = 1)
   */
  async getRequiredAdditions(): Promise<any[]> {
    return await this.getAdditionsByType(1)
  }

  /**
   * Get optional additions (type = 2)
   */
  async getOptionalAdditions(): Promise<any[]> {
    return await this.getAdditionsByType(2)
  }
}

// Export service instance
export const additionService = new AdditionService()

// Export schemas for validation
export { createAdditionSchema, updateAdditionSchema }
