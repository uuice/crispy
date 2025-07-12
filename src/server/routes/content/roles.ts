import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import {
  roleService,
  CreateRoleData,
  UpdateRoleData,
  RoleFilters
} from '../../services/roleService'

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

    const filters = {
      title: req.query['title'] as string | undefined,
      des: req.query['des'] as string | undefined,
      module_id: req.query['module_id'] ? parseInt(req.query['module_id'] as string) : undefined,
      rule_ids: req.query['rule_ids'] as string | undefined,
      sort: req.query['sort'] ? parseInt(req.query['sort'] as string) : undefined,
      status: req.query['status'] ? parseInt(req.query['status'] as string) : undefined,
      type_id: req.query['type_id'] ? parseInt(req.query['type_id'] as string) : undefined,
      is_delete: req.query['is_delete'] ? parseInt(req.query['is_delete'] as string) : undefined,
      update_time: req.query['update_time']
        ? parseInt(req.query['update_time'] as string)
        : undefined,
      create_time: req.query['create_time']
        ? parseInt(req.query['create_time'] as string)
        : undefined
    }
    const result = await roleService.getRoles({ page, pageSize }, filters)
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching roles:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const roleController = {
  getRole,
  getRoles
}
