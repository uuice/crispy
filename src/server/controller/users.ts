import { NextFunction, Request, Response } from 'express'
import { userService } from '../services/userService'
import { error, handleError, success } from '../utils/response'
import { UserFilters } from '@src/types'

// Get single user
export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const user = await userService.getById(id)
    if (!user) {
      error(res, '用户不存在', 404)
      return
    }
    success(res, user)
  } catch (err: unknown) {
    handleError(res, err, 'getUser')
  }
}

// Get users list with pagination
export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await userService.getUsers(req.query as unknown as UserFilters)
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
    const user = await userService.create(req.body)
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

    const user = await userService.update(id, req.body)
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

    const deleted = await userService.delete(id)
    if (!deleted) {
      error(res, '用户不存在', 404)
      return
    }
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
