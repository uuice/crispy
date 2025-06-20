import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { userService } from '../../services/userService'
import { success, error, notFound, handleZodError, handleError } from '../../utils/response'

// Get single user
export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const user = await userService.getUserById(id)
    success(res, user)
  } catch (err: unknown) {
    handleError(res, err, 'getUser')
  }
}

// Get users list with pagination
export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10
    const user_name = req.query['user_name'] as string
    const status = req.query['status'] ? parseInt(req.query['status'] as string) : undefined
    const isDelete = req.query['is_delete'] ? parseInt(req.query['is_delete'] as string) : undefined
    const isAdmin = req.query['is_admin'] ? parseInt(req.query['is_admin'] as string) : undefined
    const role_id = req.query['role_id'] ? parseInt(req.query['role_id'] as string) : undefined

    const result = await userService.getUsers({
      page,
      pageSize,
      user_name,
      status,
      isDelete,
      isAdmin,
      role_id
    })
    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getUsers')
  }
}

// Export all functions as a controller object
export const userController = {
  getUser,
  getUsers
}
