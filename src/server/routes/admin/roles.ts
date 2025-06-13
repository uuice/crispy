import { db } from '@src/libs/db'
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'

// Validation schemas
const createRoleSchema = z.object({
  title: z.string().min(1),
  des: z.string().optional(),
  module_id: z.number().default(0),
  rule_ids: z.string().default(''),
  sort: z.number().default(0),
  status: z.number().default(10),
  type_id: z.number().default(0)
})

const updateRoleSchema = createRoleSchema.partial()

// Get single role
export const getRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const role = await db
      .selectFrom('roles')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!role) {
      notFound(res, 'Role not found')
      return
    }

    success(res, role)
  } catch (err: unknown) {
    console.error('Error fetching role:', err)
    error(res, 'Internal server error')
  }
}

// Get roles list with pagination
export const getRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10
    const offset = (page - 1) * pageSize

    // Get filters from query
    const title = req.query['title'] as string | undefined
    const moduleId = req.query['module_id'] ? parseInt(req.query['module_id'] as string) : undefined
    const typeId = req.query['type_id'] ? parseInt(req.query['type_id'] as string) : undefined
    const status = req.query['status'] ? parseInt(req.query['status'] as string) : undefined

    let query = db.selectFrom('roles').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (title) {
      query = query.where('title', 'like', `%${title}%`)
    }
    if (moduleId !== undefined && !isNaN(moduleId)) {
      query = query.where('module_id', '=', moduleId)
    }
    if (typeId !== undefined && !isNaN(typeId)) {
      query = query.where('type_id', '=', typeId)
    }
    if (status !== undefined && !isNaN(status)) {
      query = query.where('status', '=', status)
    }

    // Order by sort asc, create_time desc by default
    query = query.orderBy('sort', 'asc').orderBy('create_time', 'desc')

    const [roles, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    success(res, {
      data: roles,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    })
  } catch (err: unknown) {
    console.error('Error fetching roles:', err)
    error(res, 'Internal server error')
  }
}

// Create new role
export const createRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createRoleSchema.parse(req.body)

    const now = Date.now()
    const newRole = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.insertInto('roles').values(newRole).executeTakeFirst()

    success(
      res,
      {
        id: Number(result.insertId),
        ...newRole
      },
      'Role created successfully'
    )
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error creating role:', err)
    error(res, 'Internal server error')
  }
}

// Update role
export const updateRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const validatedData = updateRoleSchema.parse(req.body)

    const updateData = {
      ...validatedData,
      update_time: Date.now()
    }

    const result = await db
      .updateTable('roles')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Role not found')
      return
    }

    success(res, { id, ...updateData }, 'Role updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error updating role:', err)
    error(res, 'Internal server error')
  }
}

// Delete role (logical delete)
export const deleteRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const result = await db
      .updateTable('roles')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Role not found')
      return
    }

    success(res, null, 'Role deleted successfully')
  } catch (err: unknown) {
    console.error('Error deleting role:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const roleController = {
  getRole,
  getRoles,
  createRole,
  updateRole,
  deleteRole
}
