import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import {
  roleService,
  CreateRoleData,
  UpdateRoleData,
  RoleFilters
} from '../../services/roleService'

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

    const role = await roleService.getRoleById(id)

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

    // Build filters from query
    const filters: RoleFilters = {}
    if (req.query['title']) {
      filters.title = req.query['title'] as string
    }
    if (req.query['module_id']) {
      filters.module_id = parseInt(req.query['module_id'] as string)
    }
    if (req.query['type_id']) {
      filters.type_id = parseInt(req.query['type_id'] as string)
    }
    if (req.query['status']) {
      filters.status = parseInt(req.query['status'] as string)
    }

    const result = await roleService.getRoles({ page, pageSize }, filters)
    success(res, result)
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
    const validatedData = createRoleSchema.parse(req.body) as CreateRoleData

    const newRole = await roleService.createRole(validatedData)
    success(res, newRole, 'Role created successfully')
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

    const validatedData = updateRoleSchema.parse(req.body) as UpdateRoleData

    const updated = await roleService.updateRole(id, validatedData)

    if (!updated) {
      notFound(res, 'Role not found')
      return
    }

    success(res, { id, ...validatedData }, 'Role updated successfully')
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

    const deleted = await roleService.deleteRole(id)

    if (!deleted) {
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
