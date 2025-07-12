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

    const filters = {
      user_name: req.query['user_name'] as string | undefined,
      real_name: req.query['real_name'] as string | undefined,
      nick_name: req.query['nick_name'] as string | undefined,
      email: req.query['email'] as string | undefined,
      phone: req.query['phone'] as string | undefined,
      avatar_url: req.query['avatar_url'] as string | undefined,
      password: req.query['password'] as string | undefined,
      role_id: req.query['role_id'] ? parseInt(req.query['role_id'] as string) : undefined,
      type_id: req.query['type_id'] ? parseInt(req.query['type_id'] as string) : undefined,
      status: req.query['status'] ? parseInt(req.query['status'] as string) : undefined,
      isAdmin: req.query['is_admin'] ? parseInt(req.query['is_admin'] as string) : undefined,
      is_super_admin: req.query['is_super_admin']
        ? parseInt(req.query['is_super_admin'] as string)
        : undefined,
      is_black: req.query['is_black'] ? parseInt(req.query['is_black'] as string) : undefined,
      isDelete: req.query['is_delete'] ? parseInt(req.query['is_delete'] as string) : undefined,
      last_login_ip: req.query['last_login_ip'] as string | undefined,
      last_login_time: req.query['last_login_time']
        ? parseInt(req.query['last_login_time'] as string)
        : undefined,
      update_time: req.query['update_time']
        ? parseInt(req.query['update_time'] as string)
        : undefined,
      create_time: req.query['create_time']
        ? parseInt(req.query['create_time'] as string)
        : undefined,
      start_time: req.query['start_time'] ? parseInt(req.query['start_time'] as string) : undefined,
      end_time: req.query['end_time'] ? parseInt(req.query['end_time'] as string) : undefined
    }
    const result = await userService.getUsers({ page, pageSize }, filters)
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
