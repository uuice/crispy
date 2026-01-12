import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { userTypeService } from '../../services/userTypeService'
import { success, error, validationError, notFound } from '../../utils/response'

// Get single user type
export const getUserType = async (
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

    const userType = await userTypeService.getUserTypeById(id)
    success(res, userType)
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'User type not found') {
      notFound(res, 'User type not found')
      return
    }
    console.error('Error fetching user type:', err)
    error(res, 'Internal server error')
  }
}

// Get user types list with pagination
export const getUserTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10

    const filters = {
      type_name: req.query['type_name'] as string | undefined,
      alias: req.query['alias'] as string | undefined,
      remark: req.query['remark'] as string | undefined,
      status:
        req.query['status'] !== undefined ? parseInt(req.query['status'] as string) : undefined,
      is_delete:
        req.query['is_delete'] !== undefined
          ? parseInt(req.query['is_delete'] as string)
          : undefined,
      update_time: req.query['update_time']
        ? parseInt(req.query['update_time'] as string)
        : undefined,
      create_time: req.query['create_time']
        ? parseInt(req.query['create_time'] as string)
        : undefined
    }
    const result = await userTypeService.getUserTypes({ page, pageSize }, filters)
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching user types:', err)
    error(res, 'Internal server error')
  }
}

// Create new user type
export const createUserType = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userType = await userTypeService.createUserType(req.body)
    success(res, userType, 'User type created successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.issues)
      return
    }
    console.error('Error creating user type:', err)
    error(res, 'Internal server error')
  }
}

// Update user type
export const updateUserType = async (
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

    const userType = await userTypeService.updateUserType(id, req.body)
    success(res, userType, 'User type updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.issues)
      return
    }
    if (err instanceof Error && err.message === 'User type not found') {
      notFound(res, 'User type not found')
      return
    }
    console.error('Error updating user type:', err)
    error(res, 'Internal server error')
  }
}

// Delete user type (logical delete)
export const deleteUserType = async (
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

    await userTypeService.deleteUserType(id)
    success(res, null, 'User type deleted successfully')
  } catch (err: unknown) {
    if (err instanceof Error) {
      const message = err.message
      if (message === 'User type not found') {
        notFound(res, 'User type not found')
        return
      }
      if (message === 'Cannot delete user type that is in use by users') {
        error(res, 'Cannot delete user type that is in use by users', 400)
        return
      }
    }
    console.error('Error deleting user type:', err)
    error(res, 'Internal server error')
  }
}

import { Elysia } from 'elysia'
const userTypeRouter = new Elysia({
  prefix: '/user-types'
})
  .get('/', getUserTypes)
  .get('/:id', getUserType)
  .post('/', createUserType)
  .put('/:id', updateUserType)
  .delete('/:id', deleteUserType)
export default userTypeRouter
