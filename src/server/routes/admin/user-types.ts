import { db } from '@src/libs/db'
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'

// Validation schemas
const createUserTypeSchema = z.object({
  type_name: z.string().min(1),
  alias: z.string().min(1),
  remark: z.string().optional(),
  status: z.number().default(10)
})

const updateUserTypeSchema = createUserTypeSchema.partial()

// Get single user type
export const getUserType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const userType = await db
      .selectFrom('user_types')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!userType) {
      notFound(res, 'User type not found')
      return
    }

    success(res, userType)
  } catch (err: unknown) {
    console.error('Error fetching user type:', err)
    error(res, 'Internal server error')
  }
}

// Get user types list with pagination
export const getUserTypes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10
    const offset = (page - 1) * pageSize

    // Get filters from query
    const typeName = req.query['type_name'] as string | undefined
    const alias = req.query['alias'] as string | undefined
    const status = req.query['status'] ? parseInt(req.query['status'] as string) : undefined
    const startTime = req.query['start_time'] ? parseInt(req.query['start_time'] as string) : undefined
    const endTime = req.query['end_time'] ? parseInt(req.query['end_time'] as string) : undefined

    let query = db.selectFrom('user_types').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (typeName) {
      query = query.where('type_name', 'like', `%${typeName}%`)
    }
    if (alias) {
      query = query.where('alias', 'like', `%${alias}%`)
    }
    if (status !== undefined && !isNaN(status)) {
      query = query.where('status', '=', status)
    }
    if (startTime) {
      query = query.where('create_time', '>=', startTime)
    }
    if (endTime) {
      query = query.where('create_time', '<=', endTime)
    }

    // Order by create_time desc by default
    query = query.orderBy('create_time', 'desc')

    const [userTypes, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    success(res, {
      data: userTypes,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    })
  } catch (err: unknown) {
    console.error('Error fetching user types:', err)
    error(res, 'Internal server error')
  }
}

// Create new user type
export const createUserType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createUserTypeSchema.parse(req.body)

    const now = Date.now()
    const newUserType = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.insertInto('user_types').values(newUserType).executeTakeFirst()

    success(
      res,
      {
        id: Number(result.insertId),
        ...newUserType
      },
      'User type created successfully'
    )
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error creating user type:', err)
    error(res, 'Internal server error')
  }
}

// Update user type
export const updateUserType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const validatedData = updateUserTypeSchema.parse(req.body)

    const updateData = {
      ...validatedData,
      update_time: Date.now()
    }

    const result = await db
      .updateTable('user_types')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'User type not found')
      return
    }

    success(res, { id, ...updateData }, 'User type updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error updating user type:', err)
    error(res, 'Internal server error')
  }
}

// Delete user type (logical delete)
export const deleteUserType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    // Check if user type is in use
    const usersWithType = await db
      .selectFrom('users')
      .select('id')
      .where('type_id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (usersWithType) {
      error(res, 'Cannot delete user type that is in use by users', 400)
      return
    }

    const result = await db
      .updateTable('user_types')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'User type not found')
      return
    }

    success(res, null, 'User type deleted successfully')
  } catch (err: unknown) {
    console.error('Error deleting user type:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const userTypeController = {
  getUserType,
  getUserTypes,
  createUserType,
  updateUserType,
  deleteUserType
}
