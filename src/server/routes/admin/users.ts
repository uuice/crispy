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

    const result = await userService.getUsers({
      page,
      pageSize,
      user_name,
      status,
      isDelete,
      isAdmin
    })
    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getUsers')
  }
}

// Create new user
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userService.createUser(req.body)
    success(res, user, '用户创建成功')
  } catch (err: unknown) {
    handleError(res, err, 'createUser')
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
      error(res, '无效的ID', 400)
      return
    }

    const user = await userService.updateUser(id, req.body)
    success(res, user, '用户更新成功')
  } catch (err: unknown) {
    handleError(res, err, 'updateUser')
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
      error(res, '无效的ID', 400)
      return
    }

    await userService.deleteUser(id)
    success(res, null, '用户删除成功')
  } catch (err: unknown) {
    handleError(res, err, 'deleteUser')
  }
}

// Login user
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await userService.login(req.body)
    success(res, result, '登录成功')
  } catch (err: unknown) {
    handleError(res, err, 'login')
  }
}

// Logout user (client-side token removal)
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Since we're using JWT, we don't need to do anything on the server side
    // The client should remove the token
    success(res, null, '退出登录成功')
  } catch (err: unknown) {
    handleError(res, err, 'logout')
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
      error(res, '无效的用户ID', 400)
      return
    }

    // Check if current user is authenticated
    const currentUser = req.user
    if (!currentUser) {
      error(res, '未授权访问', 401)
      return
    }

    console.log(currentUser)

    await userService.resetPassword(id, req.body, parseInt(currentUser.id))
    success(res, null, '密码重置成功')
  } catch (err: unknown) {
    handleError(res, err, 'resetPassword')
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
