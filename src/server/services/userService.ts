import { db } from '@src/libs/db'
import { generateToken } from '../middleware/jwt'
import bcrypt from 'bcryptjs'
import { DELETE_STATUS, PUBLISH_STATUS, STATUS_TRUE, USER_STATUS } from '../config/const'
import {
  CreateSuccess,
  CreateUser,
  createUserSchema,
  LoginData,
  LoginResult,
  loginSchema,
  PaginatedResult,
  ResetPasswordData,
  resetPasswordSchema,
  UpdateSuccess,
  UpdateUser,
  updateUserSchema,
  UserEntity,
  UserFilters
} from '@src/types'

// User Service Class
export class UserService {
  /**
   * Get a single user by ID
   * @param id User id
   * @returns User without password or null if not found
   */
  async getById(id: number): Promise<Omit<UserEntity, 'password'> | null> {
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!user) {
      return null
    }
    const { password: _, ...userWithoutPassword } = user

    return userWithoutPassword
  }

  /**
   * Get a single user by user_name
   * @param user_name Username
   * @returns User without password or null if not found
   */
  async getByUserName(user_name: string): Promise<Omit<UserEntity, 'password'> | null> {
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('user_name', '=', user_name)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!user) {
      return null
    }

    const { password: _, ...userWithoutPassword } = user

    return userWithoutPassword
  }

  /**
   * Get users list with pagination
   * @param filters Filter options
   * @param options Pagination options
   * @returns List of users and pagination info
   */
  async getUsers(
    filters: UserFilters
  ): Promise<
    PaginatedResult<Omit<UserEntity, 'password'> & { role: { id: number; title: string } | null }>
  > {
    const page = Number(filters.page) || 1
    const pageSize = Number(filters.pageSize) || 10
    const offset = (page - 1) * pageSize
    // Build query conditions with LEFT JOIN to get role information
    let query = db
      .selectFrom('users')
      .leftJoin('roles', 'users.role_id', 'roles.id')
      .selectAll('users')
      .select(['roles.id as role_id', 'roles.title as role_title'])
    // Apply filters
    const {
      user_name,
      nick_name,
      real_name,
      email,
      phone,
      status,
      is_delete,
      is_admin,
      is_super_admin,
      is_black,
      role_id,
      type_id,
      create_time_start,
      create_time_end,
      last_login_start,
      last_login_end
    } = filters

    if (user_name) {
      query = query.where('users.user_name', 'like', `%${user_name}%`)
    }

    if (nick_name) {
      query = query.where('users.nick_name', 'like', `%${nick_name}%`)
    }

    if (real_name) {
      query = query.where('users.real_name', 'like', `%${real_name}%`)
    }

    if (email) {
      query = query.where('users.email', 'like', `%${email}%`)
    }

    if (phone) {
      query = query.where('users.phone', 'like', `%${phone}%`)
    }

    if (status !== undefined) {
      query = query.where('users.status', '=', status)
    }

    if (is_delete !== undefined) {
      query = query.where('users.is_delete', '=', is_delete)
    } else {
      query = query.where('users.is_delete', '=', DELETE_STATUS.UN_DELETE)
    }

    if (is_admin !== undefined) {
      query = query.where('users.is_admin', '=', is_admin)
    }

    if (is_super_admin !== undefined) {
      query = query.where('users.is_super_admin', '=', is_super_admin)
    }

    if (is_black !== undefined) {
      query = query.where('users.is_black', '=', is_black)
    }

    if (role_id !== undefined) {
      query = query.where('users.role_id', '=', role_id)
    }

    if (type_id !== undefined) {
      query = query.where('users.type_id', '=', type_id)
    }

    if (create_time_start !== undefined) {
      query = query.where('users.create_time', '>=', create_time_start)
    }

    if (create_time_end !== undefined) {
      query = query.where('users.create_time', '<=', create_time_end)
    }

    if (last_login_start !== undefined) {
      query = query.where('users.last_login_time', '>=', last_login_start)
    }

    if (last_login_end !== undefined) {
      query = query.where('users.last_login_time', '<=', last_login_end)
    }
    const [users, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      db
        .selectFrom('users')
        .select((eb) => [eb.fn.count('id').as('count')])
        .$call((qb) => {
          // Apply same filters to count query
          if (user_name) {
            qb = qb.where('user_name', 'like', `%${user_name}%`)
          }
          if (nick_name) {
            qb = qb.where('nick_name', 'like', `%${nick_name}%`)
          }
          if (real_name) {
            qb = qb.where('real_name', 'like', `%${real_name}%`)
          }
          if (email) {
            qb = qb.where('email', 'like', `%${email}%`)
          }
          if (phone) {
            qb = qb.where('phone', 'like', `%${phone}%`)
          }
          if (status !== undefined) {
            qb = qb.where('status', '=', status)
          }
          if (is_delete !== undefined) {
            qb = qb.where('is_delete', '=', is_delete)
          } else {
            qb = qb.where('is_delete', '=', DELETE_STATUS.UN_DELETE)
          }
          if (is_admin !== undefined) {
            qb = qb.where('is_admin', '=', is_admin)
          }
          if (is_super_admin !== undefined) {
            qb = qb.where('is_super_admin', '=', is_super_admin)
          }
          if (is_black !== undefined) {
            qb = qb.where('is_black', '=', is_black)
          }
          if (role_id !== undefined) {
            qb = qb.where('role_id', '=', role_id)
          }
          if (type_id !== undefined) {
            qb = qb.where('type_id', '=', type_id)
          }
          if (create_time_start !== undefined) {
            qb = qb.where('create_time', '>=', create_time_start)
          }
          if (create_time_end !== undefined) {
            qb = qb.where('create_time', '<=', create_time_end)
          }
          if (last_login_start !== undefined) {
            qb = qb.where('last_login_time', '>=', last_login_start)
          }
          if (last_login_end !== undefined) {
            qb = qb.where('last_login_time', '<=', last_login_end)
          }
          return qb
        })
        .executeTakeFirst()
    ])
    // Transform users data to include role information
    const usersWithRoles = users.map((user) => {
      const { password: _, ...userWithoutPassword } = user
      return {
        ...userWithoutPassword,
        role:
          userWithoutPassword.role_id && userWithoutPassword.role_title
            ? {
                id: userWithoutPassword.role_id,
                title: userWithoutPassword.role_title
              }
            : null
      }
    })
    return {
      dataList: usersWithRoles,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Create a new user
   * @param createData User data without id
   * @returns Created user id
   */
  async create(createData: CreateUser): Promise<CreateSuccess> {
    // 验证
    const validatedData = createUserSchema.parse(createData)
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(validatedData.password, salt)
    const now = Date.now()
    const newUser = {
      ...validatedData,
      password: hashedPassword, // Store hashed password
      create_time: now,
      update_time: now,
      is_delete: DELETE_STATUS.UN_DELETE
    }

    const result = await db.insertInto('users').values(newUser).executeTakeFirst()
    if (!result) throw new Error('创建用户失败')

    return { id: Number(result.insertId) }
  }

  /**
   * Update an existing user
   * @param id User id
   * @param updateData Data to update
   * @returns Updated user id
   */
  async update(id: number, updateData: UpdateUser): Promise<UpdateSuccess> {
    // 验证
    const validatedData = updateUserSchema.parse(updateData)
    const newUpdateData = {
      ...validatedData,
      update_time: Date.now()
    }

    // Hash password if it's being updated
    if (validatedData.password) {
      const salt = await bcrypt.genSalt(10)
      newUpdateData.password = await bcrypt.hash(validatedData.password, salt)
    }

    const result = await db
      .updateTable('users')
      .set(newUpdateData)
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      throw new Error('用户不存在')
    }

    return { id }
  }

  /**
   * Soft delete user
   * @param id User id
   * @returns true if deleted successfully
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .updateTable('users')
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
   * Authenticate user login
   */
  async login(loginData: LoginData): Promise<LoginResult> {
    const { user_name, password } = loginSchema.parse(loginData)
    // Find user by username
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('user_name', '=', user_name)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!user) {
      throw new Error('用户名或密码错误')
    }

    // // test password. create a new password
    // const salt = await bcrypt.genSalt(10)
    // const hashedPassword = await bcrypt.hash(password, salt)
    // console.debug(hashedPassword)

    // Verify password using bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new Error('用户名或密码错误')
    }

    // Check user status
    if (user.status !== USER_STATUS.ENABLE) {
      throw new Error('账户已被禁用')
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id.toString(),
      user_name: user.user_name,
      real_name: user.real_name,
      nick_name: user.nick_name,
      avatar_url: user.avatar_url
    })

    // Update last login time
    await db
      .updateTable('users')
      .set({
        last_login_time: Date.now()
      })
      .where('id', '=', user.id)
      .execute()

    // get user role
    const role = await db
      .selectFrom('roles')
      .selectAll()
      .where('id', '=', user.role_id)
      .where('status', '=', PUBLISH_STATUS.PUBLISHED)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!role) {
      throw new Error('用户角色不存在')
    }

    const rule_ids = role.rule_ids.split(',').map((id) => parseInt(id))

    // get user rule
    const rules = await db
      .selectFrom('rules')
      .selectAll()
      .where('id', 'in', rule_ids)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .execute()

    // Build menu tree structure
    const buildMenuTree = (parentId: number = 0): any[] => {
      return rules
        .filter((rule) => rule.parent_id === parentId)
        .map((rule) => ({
          ...rule,
          icon: rule.icon || 'pi pi-home',
          label: rule.title,
          routerLink: rule.condition,
          children: buildMenuTree(rule.id)
        }))
    }

    const menus = buildMenuTree()

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user
    return {
      user: {
        ...userWithoutPassword,
        role
      },
      token,
      menus
    }
  }

  /**
   * Reset user password
   */
  async resetPassword(
    id: number,
    resetData: ResetPasswordData,
    currentUserId: number
  ): Promise<void> {
    // Validate request body
    const { password, new_password } = resetPasswordSchema.parse(resetData)

    // Check if current user is admin
    const user = await db
      .selectFrom('users')
      .select(['is_admin', 'is_super_admin'])
      .where('id', '=', currentUserId)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    console.log(user)
    if (!user) {
      throw new Error('当前用户不存在')
    }

    // Check if target user exists
    const targetUser = await db
      .selectFrom('users')
      .select(['id', 'is_delete', 'status', 'password', 'is_admin', 'is_super_admin'])
      .where('id', '=', id)
      .executeTakeFirst()

    if (!targetUser || targetUser.is_delete !== DELETE_STATUS.UN_DELETE) {
      throw new Error('被修改用户不存在')
    }

    if (targetUser.status !== USER_STATUS.ENABLE) {
      throw new Error('无法重置已禁用用户的密码')
    }

    // Permission checks based on user types
    const isCurrentUserSuperAdmin = user.is_super_admin === STATUS_TRUE
    const isCurrentUserAdmin = user.is_admin === STATUS_TRUE
    const isTargetUserAdmin =
      targetUser.is_admin === STATUS_TRUE || targetUser.is_super_admin === STATUS_TRUE

    // Super admin can reset any password without verification
    if (isCurrentUserSuperAdmin) {
      // No additional checks needed
    }
    // Admin can only reset non-admin passwords
    else if (isCurrentUserAdmin) {
      if (isTargetUserAdmin) {
        throw new Error('管理员只能重置普通用户的密码')
      }
    }
    // Regular user can only reset their own password with old password verification
    else {
      if (currentUserId !== id) {
        throw new Error('只能重置自己的密码')
      }
      if (!password) {
        throw new Error('需要提供原密码')
      }
      // Verify old password
      const isValidOldPassword = await bcrypt.compare(password, targetUser.password)
      if (!isValidOldPassword) {
        throw new Error('原密码错误')
      }
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(new_password, salt)
    // Update password
    const result = await db
      .updateTable('users')
      .set({
        password: hashedPassword,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      throw new Error('用户不存在')
    }
  }

  /**
   * Check if user exists by username
   * @param username Username
   * @returns true if exists
   */
  async userExistsByUsername(username: string): Promise<boolean> {
    const user = await db
      .selectFrom('users')
      .select(['id'])
      .where('user_name', '=', username)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    return !!user
  }

  /**
   * Check if user exists by email
   * @param email Email
   * @returns true if exists
   */
  async userExistsByEmail(email: string): Promise<boolean> {
    const user = await db
      .selectFrom('users')
      .select(['id'])
      .where('email', '=', email)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    return !!user
  }

  /**
   * Count total users
   * @returns Total user count
   */
  async countUsers(): Promise<number> {
    const result = await db
      .selectFrom('users')
      .select((eb) => [eb.fn.count('id').as('count')])
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return Number(result?.count) || 0
  }
}

// Export service instance
export const userService = new UserService()
