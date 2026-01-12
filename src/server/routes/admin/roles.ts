import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, notFound, handleError } from '../../utils/response'
import {
  roleService,
  CreateRoleData,
  UpdateRoleData,
  RoleFilters
} from '../../services/roleService'

// Validation schemas
const createRoleSchema = z.object({
  title: z.string().min(1, '角色名称不能为空'),
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
    handleError(res, err, 'getRole')
  }
}

// Get roles list with pagination
export const getRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10

    const filters = {
      title: req.query['title'] as string | undefined,
      des: req.query['des'] as string | undefined,
      module_id:
        req.query['module_id'] !== undefined
          ? parseInt(req.query['module_id'] as string)
          : undefined,
      rule_ids: req.query['rule_ids'] as string | undefined,
      sort: req.query['sort'] !== undefined ? parseInt(req.query['sort'] as string) : undefined,
      status:
        req.query['status'] !== undefined ? parseInt(req.query['status'] as string) : undefined,
      type_id:
        req.query['type_id'] !== undefined ? parseInt(req.query['type_id'] as string) : undefined,
      is_delete:
        req.query['is_delete'] !== undefined
          ? parseInt(req.query['is_delete'] as string)
          : undefined,
      update_time: req.query['update_time']
        ? parseInt(req.query['update_time'] as string)
        : undefined,
      create_time: req.query['create_time']
        ? parseInt(req.query['create_time'] as string)
        : undefined,
      sort_min:
        req.query['sort_min'] !== undefined ? parseInt(req.query['sort_min'] as string) : undefined,
      sort_max:
        req.query['sort_max'] !== undefined ? parseInt(req.query['sort_max'] as string) : undefined,
      start_time:
        req.query['start_time'] !== undefined
          ? parseInt(req.query['start_time'] as string)
          : undefined,
      end_time:
        req.query['end_time'] !== undefined ? parseInt(req.query['end_time'] as string) : undefined
    }
    const result = await roleService.getRoles({ page, pageSize }, filters)
    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getRoles')
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
    handleError(res, err, 'createRole')
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
    handleError(res, err, 'updateRole')
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

    const result = await roleService.deleteRole(id)

    if (result?.success) {
      success(res, null, result.message)
    } else {
      // Use the message from the service if available, otherwise a generic one
      notFound(res, result?.message || 'Role not found or could not be deleted')
    }
  } catch (err: unknown) {
    handleError(res, err, 'deleteRole')
  }
}

import { Elysia } from 'elysia'
const roleRouter = new Elysia({
  prefix: '/roles'
})
  .get('/', getRoles)
  .get('/:id', getRole)
  .post('/', createRole)
  .put('/:id', updateRole)
  .delete('/:id', deleteRole)
export default roleRouter
