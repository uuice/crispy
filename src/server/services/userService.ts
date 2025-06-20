import { db } from '@src/libs/db'
import { z } from 'zod'
import { generateToken } from '../middleware/jwt'
import bcrypt from 'bcryptjs'
import { DELETE_STATUS, STATUS_FALSE, STATUS_TRUE, USER_STATUS } from '../config/const'

// Validation schemas
const createUserSchema = z.object({
  user_name: z.string().min(1, '用户名不能为空').max(32, '用户名不能超过30个字符'),
  password: z.string().min(6, '密码至少6个字符'),
  email: z.string().email('邮箱格式不正确').optional(),
  phone: z.string().min(11, '手机号不能为空').max(11, '手机号不能超过11个字符').optional(),
  real_name: z.string().optional(),
  nick_name: z.string().optional(),
  avatar_url: z.string().optional(),
  role_id: z.number().optional(),
  type_id: z.number().optional(),
  status: z.number().default(USER_STATUS.ENABLE),
  is_admin: z.number().default(STATUS_FALSE),
  is_super_admin: z.number().default(STATUS_FALSE),
  is_black: z.number().default(STATUS_FALSE)
})

const updateUserSchema = createUserSchema.partial()

const loginSchema = z.object({
  user_name: z.string().min(1, '用户名不能为空'),
  password: z.string().min(1, '密码不能为空')
})

// Reset password schema
const resetPasswordSchema = z
  .object({
    password: z.string().min(6, '原密码至少6个字符').optional(),
    new_password: z.string().min(6, '新密码至少6个字符'),
    confirm_password: z.string().min(6, '确认密码至少6个字符')
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: '新密码和确认密码不一致',
    path: ['confirm_password']
  })

// Types
export interface CreateUserData {
  user_name: string
  password: string
  email?: string
  phone?: string
  real_name?: string
  nick_name?: string
  avatar_url?: string
  role_id?: number
  type_id?: number
  status?: number
  is_admin?: number
  is_super_admin?: number
  is_black?: number
}

export type UpdateUserData = Partial<CreateUserData>

export interface LoginData {
  user_name: string
  password: string
}

export interface ResetPasswordData {
  password: string
  new_password: string
  confirm_password: string
}

export interface PaginationOptions {
  page: number
  pageSize: number
  user_name?: string
  status?: number
  isDelete?: number
  isAdmin?: number
  role_id?: number
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

export interface LoginResult {
  user: any
  token: string
  menus: any[]
}

// User Service Class
export class UserService {
  /**
   * Get a single user by ID
   */
  async getUserById(id: number): Promise<any> {
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!user) {
      throw new Error('用户不存在')
    }

    return user
  }

  /**
   * Get a single user by user_name
   */
  async getUserByUserName(user_name: string): Promise<any> {
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('user_name', '=', user_name)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!user) {
      throw new Error('用户不存在')
    }

    return user
  }

  /**
   * Get users list with pagination
   */
  async getUsers(options: PaginationOptions): Promise<PaginatedResult<any>> {
    const { page, pageSize, user_name, status, isDelete, isAdmin, role_id } = options
    const offset = (page - 1) * pageSize

    // Build query conditions with LEFT JOIN to get role information
    let query = db
      .selectFrom('users')
      .leftJoin('roles', 'users.role_id', 'roles.id')
      .select([
        'users.id',
        'users.user_name',
        'users.nick_name',
        'users.email',
        'users.phone',
        'users.status',
        'users.is_admin',
        'users.is_super_admin',
        'users.is_black',
        'users.last_login_time',
        'users.avatar_url',
        'users.create_time',
        'users.update_time',
        'users.role_id',
        'users.type_id',
        'roles.id as role_id',
        'roles.title as role_title'
      ])

    // Apply filters
    if (user_name) {
      query = query.where('users.user_name', 'like', `%${user_name}%`)
    }

    if (status !== undefined) {
      query = query.where('users.status', '=', status)
    }

    if (isDelete !== undefined) {
      query = query.where('users.is_delete', '=', isDelete)
    } else {
      // Default to only non-deleted users
      query = query.where('users.is_delete', '=', DELETE_STATUS.UN_DELETE)
    }

    if (isAdmin !== undefined) {
      query = query.where('users.is_admin', '=', isAdmin)
    }

    if (role_id !== undefined) {
      query = query.where('users.role_id', '=', role_id)
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
          if (status !== undefined) {
            qb = qb.where('status', '=', status)
          }
          if (isDelete !== undefined) {
            qb = qb.where('is_delete', '=', isDelete)
          } else {
            qb = qb.where('is_delete', '=', DELETE_STATUS.UN_DELETE)
          }
          if (isAdmin !== undefined) {
            qb = qb.where('is_admin', '=', isAdmin)
          }
          if (role_id !== undefined) {
            qb = qb.where('role_id', '=', role_id)
          }
          return qb
        })
        .executeTakeFirst()
    ])

    // Transform users data to include role information
    const usersWithRoles = users.map((user) => ({
      ...user,
      role:
        user.role_id && user.role_title
          ? {
              id: user.role_id,
              title: user.role_title
            }
          : null
    }))

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
   */
  async createUser(userData: CreateUserData): Promise<any> {
    // Validate input data
    const validatedData = createUserSchema.parse(userData)
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

    // Remove password from response
    const { password: _, ...userWithoutPassword } = {
      id: Number(result.insertId),
      ...newUser
    }

    return userWithoutPassword
  }

  /**
   * Update an existing user
   */
  async updateUser(id: number, userData: UpdateUserData): Promise<any> {
    // Validate input data
    const validatedData = updateUserSchema.parse(userData)
    const updateData: any = {
      ...validatedData,
      update_time: Date.now()
    }

    // Hash password if it's being updated
    if (validatedData.password) {
      const salt = await bcrypt.genSalt(10)
      updateData.password = await bcrypt.hash(validatedData.password, salt)
    }

    const result = await db
      .updateTable('users')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      throw new Error('用户不存在')
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = { id, ...updateData }
    return userWithoutPassword
  }

  /**
   * Delete a user (logical delete)
   */
  async deleteUser(id: number): Promise<void> {
    const result = await db
      .updateTable('users')
      .set({
        is_delete: DELETE_STATUS.DELETE,
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
      .executeTakeFirst()

    if (!role) {
      throw new Error('用户角色不存在')
    }

    const rule_ids = role.rule_ids
      .slice(1, -1)
      .split('&')
      .map((id) => parseInt(id))

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
}

// Export service instance
export const userService = new UserService()

// Export schemas for validation
export { createUserSchema, updateUserSchema, loginSchema, resetPasswordSchema }
