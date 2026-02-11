import { db } from '@src/libs/db'
import { DELETE_STATUS } from '../config/const'
import {
  CreateRole,
  createRoleSchema,
  CreateSuccess,
  PaginatedResult,
  RoleEntity,
  RoleFilters,
  UpdateRole,
  updateRoleSchema,
  UpdateSuccess
} from '@src/types'

export class RoleService {
  /**
   * Get single role by ID
   */
  async getById(id: number): Promise<RoleEntity | null> {
    const role = await db
      .selectFrom('roles')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    return role || null
  }

  /**
   * Get roles list with pagination and filters
   */
  async getRoles(filters: RoleFilters): Promise<PaginatedResult<RoleEntity>> {
    const page = Number(filters.page) || 1
    const pageSize = Number(filters.pageSize) || 10
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('roles').selectAll()

    // Apply filters
    if (filters.title) {
      query = query.where('title', 'like', `%${filters.title}%`)
    }
    if (filters.des) {
      query = query.where('des', 'like', `%${filters.des}%`)
    }
    if (filters.module_id !== undefined) {
      query = query.where('module_id', '=', filters.module_id)
    }
    if (filters.type_id !== undefined) {
      query = query.where('type_id', '=', filters.type_id)
    }
    if (filters.status !== undefined) {
      query = query.where('status', '=', filters.status)
    }
    if (filters.sort !== undefined) {
      query = query.where('sort', '=', filters.sort)
    }
    if (filters.rule_ids) {
      query = query.where('rule_ids', 'like', `%${filters.rule_ids}%`)
    }

    query = query.where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    const [roles, total] = await Promise.all([
      query
        .orderBy('sort', 'asc')
        .orderBy('create_time', 'desc')
        .limit(pageSize)
        .offset(offset)
        .execute(),
      db
        .selectFrom('roles')
        .select((eb) => [eb.fn.count('id').as('count')])
        .$call((qb) => {
          if (filters.title) {
            qb = qb.where('title', 'like', `%${filters.title}%`)
          }
          if (filters.des) {
            qb = qb.where('des', 'like', `%${filters.des}%`)
          }
          if (filters.module_id !== undefined) {
            qb = qb.where('module_id', '=', filters.module_id)
          }
          if (filters.type_id !== undefined) {
            qb = qb.where('type_id', '=', filters.type_id)
          }
          if (filters.status !== undefined) {
            qb = qb.where('status', '=', filters.status)
          }
          if (filters.sort !== undefined) {
            qb = qb.where('sort', '=', filters.sort)
          }
          if (filters.rule_ids) {
            qb = qb.where('rule_ids', 'like', `%${filters.rule_ids}%`)
          }
          qb = qb.where('is_delete', '=', DELETE_STATUS.UN_DELETE)
          return qb
        })
        .executeTakeFirst()
    ])

    return {
      dataList: roles,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Create new role
   */
  async create(createData: CreateRole): Promise<CreateSuccess> {
    const validatedData = createRoleSchema.parse(createData)
    const now = Date.now()
    const newRole = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: DELETE_STATUS.UN_DELETE
    }

    const result = await db.insertInto('roles').values(newRole).executeTakeFirst()
    if (!result) throw new Error('创建角色失败')
    return { id: Number(result.insertId) }
  }

  /**
   * Update role by ID
   */
  async update(id: number, updateData: UpdateRole): Promise<UpdateSuccess> {
    const validatedData = updateRoleSchema.parse(updateData)
    const result = await db
      .updateTable('roles')
      .set({ ...validatedData, update_time: Date.now() })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!result) throw new Error('更新角色失败')
    return { id }
  }

  /**
   * Delete role (logical delete)
   * Checks if role is assigned to any users before deletion
   */
  async delete(id: number): Promise<boolean> {
    // Check if the role is currently assigned to any non-deleted users
    const userCountResult = await db
      .selectFrom('users')
      .select((eb) => eb.fn.countAll().as('count'))
      .where('role_id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (userCountResult && Number(userCountResult.count) > 0) {
      throw new Error('该角色正在被使用，无法删除')
    }

    const result = await db
      .updateTable('roles')
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
   * Get roles by status
   */
  async getRolesByStatus(status: number): Promise<RoleEntity[]> {
    const roles = await db
      .selectFrom('roles')
      .selectAll()
      .where('status', '=', status)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()

    return roles
  }

  /**
   * Get roles by module ID
   */
  async getRolesByModuleId(moduleId: number): Promise<RoleEntity[]> {
    const roles = await db
      .selectFrom('roles')
      .selectAll()
      .where('module_id', '=', moduleId)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()

    return roles
  }

  /**
   * Get roles by type ID
   */
  async getRolesByTypeId(typeId: number): Promise<RoleEntity[]> {
    const roles = await db
      .selectFrom('roles')
      .selectAll()
      .where('type_id', '=', typeId)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()

    return roles
  }

  /**
   * Search roles by title
   */
  async searchRoles(searchTerm: string): Promise<RoleEntity[]> {
    const roles = await db
      .selectFrom('roles')
      .selectAll()
      .where('title', 'like', `%${searchTerm}%`)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()

    return roles
  }

  /**
   * Get roles count by status
   */
  async getRolesCountByStatus(): Promise<{ status: number; count: number }[]> {
    const results = await db
      .selectFrom('roles')
      .select((eb) => ['status', eb.fn.count('id').as('count')])
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .groupBy('status')
      .execute()

    return results.map((r) => ({
      status: r.status,
      count: Number(r.count)
    }))
  }

  /**
   * Check if role exists by title
   */
  async checkRoleExistsByTitle(title: string, excludeId?: number): Promise<boolean> {
    let query = db
      .selectFrom('roles')
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
   * Get roles statistics
   */
  async getRolesStats(): Promise<{
    total: number
    active: number
    inactive: number
    deleted: number
  }> {
    const stats = await db
      .selectFrom('roles')
      .select((eb) => [
        eb.fn.count('id').as('total'),
        eb.fn.sum<number>(eb.case().when('status', '=', 10).then(1).else(0).end()).as('active'),
        eb.fn.sum<number>(eb.case().when('status', '=', 0).then(1).else(0).end()).as('inactive'),
        eb.fn
          .sum<number>(eb.case().when('is_delete', '=', DELETE_STATUS.DELETE).then(1).else(0).end())
          .as('deleted')
      ])
      .executeTakeFirst()

    return {
      total: Number(stats?.total) || 0,
      active: Number(stats?.active) || 0,
      inactive: Number(stats?.inactive) || 0,
      deleted: Number(stats?.deleted) || 0
    }
  }
}

// Export singleton instance
export const roleService = new RoleService()
