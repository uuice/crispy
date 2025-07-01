import { db } from '@src/libs/db'
import { sql } from 'kysely'
import { DELETE_STATUS, PUBLISH_STATUS } from '../config/const'

// Data interfaces
export interface CreateRoleData {
  title: string
  des?: string
  module_id: number
  rule_ids: string
  sort: number
  status: number
  type_id: number
}

export type UpdateRoleData = Partial<CreateRoleData>

export interface RoleFilters {
  title?: string
  module_id?: number
  type_id?: number
  status?: number
}

export interface RolePaginationParams {
  page: number
  pageSize: number
}

export interface Role {
  id: number
  title: string
  des?: string
  module_id: number
  rule_ids: string
  sort: number
  status: number
  type_id: number
  create_time: number
  update_time: number
  is_delete: number
}

export interface PaginatedRolesResult {
  dataList: Role[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export class RoleService {
  /**
   * Get single role by ID
   */
  async getRoleById(id: number): Promise<Role | null> {
    const result = await db
      .selectFrom('roles')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return result as unknown as Role | null
  }

  /**
   * Get roles list with pagination and filters
   */
  async getRoles(
    pagination: RolePaginationParams,
    filters?: RoleFilters
  ): Promise<PaginatedRolesResult> {
    const { page, pageSize } = pagination
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('roles').selectAll().where('is_delete', '=', 0)

    // Apply filters
    if (filters) {
      if (filters.title) {
        query = query.where('title', 'like', `%${filters.title}%`)
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
    }

    // Order by sort asc, create_time desc by default
    query = query.orderBy('sort', 'asc').orderBy('create_time', 'desc')

    const [roles, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    return {
      dataList: roles as unknown as Role[],
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
  async createRole(data: CreateRoleData): Promise<Role> {
    const now = Date.now()
    const newRole = {
      ...data,
      create_time: now,
      update_time: now,
      status: PUBLISH_STATUS.PUBLISHED,
      is_delete: DELETE_STATUS.UN_DELETE
    }

    const result = await db.safeInsertInto('roles').values(newRole).executeTakeFirst()

    return {
      id: Number(result.insertId),
      ...newRole
    }
  }

  /**
   * Update role by ID
   */
  async updateRole(id: number, data: UpdateRoleData): Promise<boolean> {
    const updateData = {
      ...data,
      update_time: Date.now()
    }

    const result = await db
      .safeUpdateTable('roles')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return result.numUpdatedRows > 0n
  }

  /**
   * Delete role (logical delete)
   */
  async deleteRole(id: number): Promise<{ success: boolean; message?: string }> {
    // Check if the role is currently assigned to any non-deleted users
    const userCountResult = await db
      .selectFrom('users')
      .select((eb) => eb.fn.countAll().as('count'))
      .where('role_id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    console.log(userCountResult)

    if (userCountResult && Number(userCountResult.count) > 0) {
      throw new Error('该角色正在被使用，无法删除。')
    }

    const result = await db
      .safeUpdateTable('roles')
      .set({
        is_delete: DELETE_STATUS.DELETE,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    console.log(result)

    if (result.numUpdatedRows > 0n) {
      return { success: true, message: '角色删除成功。' }
    }
    return { success: false, message: '角色不存在或已被删除。' }
  }

  /**
   * Get roles by status
   */
  async getRolesByStatus(status: number): Promise<Role[]> {
    const result = await db
      .selectFrom('roles')
      .selectAll()
      .where('status', '=', status)
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()

    return result as unknown as Role[]
  }

  /**
   * Get roles by module ID
   */
  async getRolesByModuleId(moduleId: number): Promise<Role[]> {
    const result = await db
      .selectFrom('roles')
      .selectAll()
      .where('module_id', '=', moduleId)
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()

    return result as unknown as Role[]
  }

  /**
   * Get roles by type ID
   */
  async getRolesByTypeId(typeId: number): Promise<Role[]> {
    const result = await db
      .selectFrom('roles')
      .selectAll()
      .where('type_id', '=', typeId)
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()

    return result as unknown as Role[]
  }

  /**
   * Search roles by title
   */
  async searchRoles(searchTerm: string): Promise<Role[]> {
    const result = await db
      .selectFrom('roles')
      .selectAll()
      .where('is_delete', '=', 0)
      .where('title', 'like', `%${searchTerm}%`)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()

    return result as unknown as Role[]
  }

  /**
   * Get roles count by status
   */
  async getRolesCountByStatus(): Promise<{ status: number; count: number }[]> {
    return await db
      .selectFrom('roles')
      .select(['status', sql<number>`count(*)`.as('count')])
      .where('is_delete', '=', 0)
      .groupBy('status')
      .execute()
  }

  /**
   * Check if role exists by title
   */
  async checkRoleExistsByTitle(title: string, excludeId?: number): Promise<boolean> {
    let query = db
      .selectFrom('roles')
      .select('id')
      .where('title', '=', title)
      .where('is_delete', '=', 0)

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
      .select([
        sql<number>`count(*)`.as('total'),
        sql<number>`sum(case when status = 10 then 1 else 0 end)`.as('active'),
        sql<number>`sum(case when status = 0 then 1 else 0 end)`.as('inactive'),
        sql<number>`sum(case when is_delete = 10 then 1 else 0 end)`.as('deleted')
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
