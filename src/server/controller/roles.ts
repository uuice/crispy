import { NextFunction, Request, Response } from 'express'
import { error, handleError, success } from '../utils/response'
import { roleService } from '../services/roleService'
import { RoleFilters } from '@src/types'

// Get single role
export const getRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const role = await roleService.getById(id)

    if (!role) {
      error(res, '角色不存在', 404)
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
    const result = await roleService.getRoles(req.query as unknown as RoleFilters)
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
    const newRole = await roleService.create(req.body)
    success(res, newRole, '角色创建成功')
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
      error(res, '无效的ID', 400)
      return
    }

    const updated = await roleService.update(id, req.body)

    if (!updated) {
      error(res, '角色不存在', 404)
      return
    }

    success(res, { id, ...req.body }, '角色更新成功')
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
      error(res, '无效的ID', 400)
      return
    }

    const deleted = await roleService.delete(id)

    if (!deleted) {
      error(res, '角色不存在', 404)
      return
    }

    success(res, null, '角色删除成功')
  } catch (err: unknown) {
    handleError(res, err, 'deleteRole')
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
