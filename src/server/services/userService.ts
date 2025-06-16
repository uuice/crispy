import { db } from '@src/libs/db'
import { z } from 'zod'
import { generateToken } from '../middleware/jwt'
import bcrypt from 'bcryptjs'

// Validation schemas
const createUserSchema = z.object({
  user_name: z.string().min(1),
  password: z.string().min(6),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  real_name: z.string().optional(),
  nick_name: z.string().optional(),
  avatar_url: z.string().optional(),
  role_id: z.number().optional(),
  type_id: z.number().optional(),
  status: z.number().default(10),
  is_admin: z.number().default(-10),
  is_super_admin: z.number().default(-10),
  is_black: z.number().default(-10)
})

const updateUserSchema = createUserSchema.partial()

const loginSchema = z.object({
  user_name: z.string().min(1),
  password: z.string().min(1)
})

// Reset password schema
const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters long')
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
}

export interface PaginationOptions {
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

export interface LoginResult {
  user: any
  token: string
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
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!user) {
      throw new Error('User not found')
    }

    return user
  }

  /**
   * Get users list with pagination
   */
  async getUsers(options: PaginationOptions): Promise<PaginatedResult<any>> {
    const { page, pageSize } = options
    const offset = (page - 1) * pageSize

    const [users, total] = await Promise.all([
      db
        .selectFrom('users')
        .selectAll()
        .where('is_delete', '=', 0)
        .limit(pageSize)
        .offset(offset)
        .execute(),
      db
        .selectFrom('users')
        .select((eb) => [eb.fn.count('id').as('count')])
        .where('is_delete', '=', 0)
        .executeTakeFirst()
    ])

    return {
      data: users,
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

    // Hash password using bcrypt with 10 rounds
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(validatedData.password, salt)

    const now = Date.now()
    const newUser = {
      ...validatedData,
      password: hashedPassword, // Store hashed password
      create_time: now,
      update_time: now,
      is_delete: 0
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
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      throw new Error('User not found')
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
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      throw new Error('User not found')
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
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!user) {
      throw new Error('Invalid username or password')
    }

    // Verify password using bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new Error('Invalid username or password')
    }

    // Check user status
    if (user.status !== 10) {
      throw new Error('Account is disabled')
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id.toString(),
      username: user.user_name
    })

    // Update last login time
    await db
      .updateTable('users')
      .set({
        last_login_time: Date.now(),
        update_time: Date.now()
      })
      .where('id', '=', user.id)
      .execute()

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user
    return {
      user: userWithoutPassword,
      token
    }
  }

  /**
   * Reset user password (admin only)
   */
  async resetPassword(
    id: number,
    resetData: ResetPasswordData,
    currentUserId: number
  ): Promise<void> {
    // Validate request body
    const { password } = resetPasswordSchema.parse(resetData)

    // Check if current user is admin
    const adminUser = await db
      .selectFrom('users')
      .select(['is_admin', 'is_super_admin'])
      .where('id', '=', currentUserId)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!adminUser || (adminUser.is_admin !== 10 && adminUser.is_super_admin !== 10)) {
      throw new Error('Permission denied. Admin access required.')
    }

    // Check if target user exists
    const targetUser = await db
      .selectFrom('users')
      .select(['id', 'is_delete', 'status'])
      .where('id', '=', id)
      .executeTakeFirst()

    if (!targetUser || targetUser.is_delete !== 0) {
      throw new Error('User not found')
    }

    if (targetUser.status !== 10) {
      throw new Error('Cannot reset password for disabled user')
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Update password
    const result = await db
      .updateTable('users')
      .set({
        password: hashedPassword,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      throw new Error('User not found')
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
      .where('is_delete', '=', 0)
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
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return !!user
  }
}

// Export service instance
export const userService = new UserService()

// Export schemas for validation
export { createUserSchema, updateUserSchema, loginSchema, resetPasswordSchema }
