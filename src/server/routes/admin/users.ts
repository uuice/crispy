import { db } from '@src/libs/db'
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { generateToken } from '../../middleware/jwt'
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

// Get single user
export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid ID' })
      return
    }

    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.json(user)
  } catch (error: unknown) {
    console.error('Error fetching user:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Get users list with pagination
export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10
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

    res.json({
      data: users,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    })
  } catch (error: unknown) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Create new user
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createUserSchema.parse(req.body)

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

    res.status(201).json(userWithoutPassword)
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: (error as z.ZodError).errors })
      return
    }
    console.error('Error creating user:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Update user
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid ID' })
      return
    }

    const validatedData = updateUserSchema.parse(req.body)
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
      res.status(404).json({ error: 'User not found' })
      return
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = { id, ...updateData }
    res.json(userWithoutPassword)
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: (error as z.ZodError).errors })
      return
    }
    console.error('Error updating user:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Delete user (logical delete)
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid ID' })
      return
    }

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
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.json({ message: 'User deleted successfully' })
  } catch (error: unknown) {
    console.error('Error deleting user:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Login user
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user_name, password } = loginSchema.parse(req.body)

    // Find user by username
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('user_name', '=', user_name)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!user) {
      res.status(401).json({ error: 'Invalid username or password' })
      return
    }

    // Verify password using bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid username or password' })
      return
    }

    // Check user status
    if (user.status !== 10) {
      res.status(403).json({ error: 'Account is disabled' })
      return
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
    res.json({
      user: userWithoutPassword,
      token
    })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: (error as z.ZodError).errors })
      return
    }
    console.error('Error during login:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Logout user (client-side token removal)
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Since we're using JWT, we don't need to do anything on the server side
    // The client should remove the token
    res.json({ message: 'Logged out successfully' })
  } catch (error: unknown) {
    console.error('Error during logout:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Reset user password (admin only)
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid user ID' })
      return
    }

    // Validate request body
    const { password } = resetPasswordSchema.parse(req.body)

    // Check if current user is admin
    const currentUser = req.user
    if (!currentUser) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    // Get current user's admin status
    const adminUser = await db
      .selectFrom('users')
      .select(['is_admin', 'is_super_admin'])
      .where('id', '=', parseInt(currentUser.id))
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!adminUser || (adminUser.is_admin !== 10 && adminUser.is_super_admin !== 10)) {
      res.status(403).json({ error: 'Permission denied. Admin access required.' })
      return
    }

    // Check if target user exists
    const targetUser = await db
      .selectFrom('users')
      .select(['id', 'is_delete', 'status'])
      .where('id', '=', id)
      .executeTakeFirst()

    if (!targetUser || targetUser.is_delete !== 0) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    if (targetUser.status !== 10) {
      res.status(400).json({ error: 'Cannot reset password for disabled user' })
      return
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
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.json({ message: 'Password reset successfully' })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: (error as z.ZodError).errors })
      return
    }
    console.error('Error resetting password:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Export all functions as a controller object
export const userController = {
  login,
  logout,
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  resetPassword
}
