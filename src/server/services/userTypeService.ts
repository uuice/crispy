import { db } from '@src/libs/db'
import { z } from 'zod'

// Validation schemas
const createUserTypeSchema = z.object({
  type_name: z.string().min(1),
  alias: z.string().min(1),
  remark: z.string().optional(),
  status: z.number().default(10)
})

const updateUserTypeSchema = createUserTypeSchema.partial()

// Types
export interface CreateUserTypeData {
  type_name: string
  alias: string
  remark?: string
  status?: number
}

export type UpdateUserTypeData = Partial<CreateUserTypeData>

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

export interface FilterOptions {
  type_name?: string
  alias?: string
  status?: number
  start_time?: number
  end_time?: number
}

// User Type Service Class
export class UserTypeService {
  /**
   * Get a single user type by ID
   */
  async getUserTypeById(id: number): Promise<any> {
    const userType = await db
      .selectFrom('user_types')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!userType) {
      throw new Error('User type not found')
    }

    return userType
  }

  /**
   * Get user types list with pagination and filters
   */
  async getUserTypes(
    options: PaginationOptions,
    filters: FilterOptions
  ): Promise<PaginatedResult<any>> {
    const { page, pageSize } = options
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('user_types').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (filters.type_name) {
      query = query.where('type_name', 'like', `%${filters.type_name}%`)
    }
    if (filters.alias) {
      query = query.where('alias', 'like', `%${filters.alias}%`)
    }
    if (filters.status !== undefined) {
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

    const [userTypes, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    return {
      dataList: userTypes,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Create a new user type
   */
  async createUserType(userTypeData: CreateUserTypeData): Promise<any> {
    // Validate input data
    const validatedData = createUserTypeSchema.parse(userTypeData)

    const now = Date.now()
    const newUserType = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.safeInsertInto('user_types').values(newUserType).executeTakeFirst()

    return {
      id: Number(result.insertId),
      ...newUserType
    }
  }

  /**
   * Update an existing user type
   */
  async updateUserType(id: number, userTypeData: UpdateUserTypeData): Promise<any> {
    // Validate input data
    const validatedData = updateUserTypeSchema.parse(userTypeData)

    const updateData = {
      ...validatedData,
      update_time: Date.now()
    }

    const result = await db
      .safeUpdateTable('user_types')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      throw new Error('User type not found')
    }

    return { id, ...updateData }
  }

  /**
   * Delete a user type (logical delete)
   */
  async deleteUserType(id: number): Promise<void> {
    // Check if user type is in use
    const usersWithType = await db
      .selectFrom('users')
      .select('id')
      .where('type_id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (usersWithType) {
      throw new Error('Cannot delete user type that is in use by users')
    }

    const result = await db
      .safeUpdateTable('user_types')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      throw new Error('User type not found')
    }
  }

  /**
   * Check if user type exists by type_name
   */
  async userTypeExistsByTypeName(typeName: string): Promise<boolean> {
    const userType = await db
      .selectFrom('user_types')
      .select(['id'])
      .where('type_name', '=', typeName)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return !!userType
  }

  /**
   * Check if user type exists by alias
   */
  async userTypeExistsByAlias(alias: string): Promise<boolean> {
    const userType = await db
      .selectFrom('user_types')
      .select(['id'])
      .where('alias', '=', alias)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return !!userType
  }
}

// Export service instance
export const userTypeService = new UserTypeService()

// Export schemas for validation
export { createUserTypeSchema, updateUserTypeSchema }
