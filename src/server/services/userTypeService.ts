import { db } from '@src/libs/db'
import { DELETE_STATUS } from '../config/const'
import {
  CreateSuccess,
  CreateUserType,
  createUserTypeSchema,
  PaginatedResult,
  UpdateSuccess,
  UpdateUserType,
  updateUserTypeSchema,
  UserTypeEntity,
  UserTypeFilters
} from '@src/types'

// User Type Service Class
export class UserTypeService {
  /**
   * Get a single user type by ID
   * @param id User type id
   * @returns User type or null if not found
   */
  async getById(id: number): Promise<UserTypeEntity | null> {
    const userType = await db
      .selectFrom('user_types')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return userType || null
  }

  /**
   * Get user types list with pagination and filters
   * @param filters Filter options
   * @param options Pagination options
   * @returns List of user types and pagination info
   */
  async getUserTypes(filters: UserTypeFilters): Promise<PaginatedResult<UserTypeEntity>> {
    const page = Number(filters.page) || 1
    const pageSize = Number(filters.pageSize) || 10
    const {
      type_name,
      alias,
      status,
      create_time_start,
      create_time_end,
      update_time_start,
      update_time_end
    } = filters
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('user_types').selectAll()

    // Apply filters
    if (type_name) {
      query = query.where('type_name', 'like', `%${type_name}%`)
    }

    if (alias) {
      query = query.where('alias', 'like', `%${alias}%`)
    }

    if (status !== undefined) {
      query = query.where('status', '=', status)
    }

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

    // Default to only non-deleted user types
    query = query.where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    const [userTypes, total] = await Promise.all([
      query.orderBy('create_time', 'desc').limit(pageSize).offset(offset).execute(),
      db
        .selectFrom('user_types')
        .select((eb) => [eb.fn.count('id').as('count')])
        .$call((qb) => {
          // Apply same filters to count query
          if (type_name) {
            qb = qb.where('type_name', 'like', `%${type_name}%`)
          }
          if (alias) {
            qb = qb.where('alias', 'like', `%${alias}%`)
          }
          if (status !== undefined) {
            qb = qb.where('status', '=', status)
          }
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
   * @param createData User type data without id
   * @returns Created user type id
   */
  async create(createData: CreateUserType): Promise<CreateSuccess> {
    // 验证
    const validatedData = createUserTypeSchema.parse(createData)
    const now = Date.now()
    const newUserType = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: DELETE_STATUS.UN_DELETE
    }

    const result = await db.insertInto('user_types').values(newUserType).executeTakeFirst()
    if (!result) throw new Error('创建用户类型失败')
    return { id: Number(result.insertId) }
  }

  /**
   * Update an existing user type
   * @param id User type id
   * @param updateData Data to update
   * @returns Updated user type id
   */
  async update(id: number, updateData: UpdateUserType): Promise<UpdateSuccess> {
    const validatedData = updateUserTypeSchema.parse(updateData)
    const result = await db
      .updateTable('user_types')
      .set({
        ...validatedData,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!result) throw new Error('更新用户类型失败')
    return { id }
  }

  /**
   * Soft delete user type
   * @param id User type id
   * @returns true if deleted successfully
   */
  async delete(id: number): Promise<boolean> {
    // Check if user type is in use
    const usersWithType = await db
      .selectFrom('users')
      .select('id')
      .where('type_id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (usersWithType) {
      throw new Error('无法删除正在使用的用户类型')
    }

    const result = await db
      .updateTable('user_types')
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
   * Check if user type exists by type_name
   * @param typeName User type name
   * @returns true if exists
   */
  async userTypeExistsByTypeName(typeName: string): Promise<boolean> {
    const userType = await db
      .selectFrom('user_types')
      .select('id')
      .where('type_name', '=', typeName)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return !!userType
  }

  /**
   * Check if user type exists by alias
   * @param alias User type alias
   * @returns true if exists
   */
  async userTypeExistsByAlias(alias: string): Promise<boolean> {
    const userType = await db
      .selectFrom('user_types')
      .select('id')
      .where('alias', '=', alias)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return !!userType
  }
}

export const userTypeService = new UserTypeService()
