import { NextFunction, Request, Response } from 'express'
import { error, handleError, success } from '../utils/response'
import { menuService } from '../services/menuService'
import { MenuFilters } from '@src/types'

// Get single menu
export const getMenu = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const menu = await menuService.getById(id)

    if (!menu) {
      error(res, '菜单不存在', 404)
      return
    }

    success(res, menu)
  } catch (err: unknown) {
    handleError(res, err, 'getMenu')
  }
}

// Get menus list with pagination
export const getMenus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await menuService.getMenus(req.query as unknown as MenuFilters)
    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getMenus')
  }
}

// Get menu tree
export const getMenuTree = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const menuTree = await menuService.getMenuTree()
    success(res, menuTree)
  } catch (err: unknown) {
    handleError(res, err, 'getMenuTree')
  }
}

// Create new menu
export const createMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newMenu = await menuService.create(req.body)
    success(res, newMenu, '菜单创建成功')
  } catch (err: unknown) {
    if (err instanceof Error) {
      error(res, err.message, 400)
      return
    }
    handleError(res, err, 'createMenu')
  }
}

// Update menu
export const updateMenu = async (
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

    const updated = await menuService.update(id, req.body)

    if (!updated) {
      error(res, '菜单不存在', 404)
      return
    }

    success(res, { id, ...req.body }, '菜单更新成功')
  } catch (err: unknown) {
    if (err instanceof Error) {
      error(res, err.message, 400)
      return
    }
    handleError(res, err, 'updateMenu')
  }
}

// Delete menu (logical delete)
export const deleteMenu = async (
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

    const deleted = await menuService.delete(id)

    if (!deleted) {
      error(res, '菜单不存在', 404)
      return
    }

    success(res, null, '菜单删除成功')
  } catch (err: unknown) {
    if (err instanceof Error) {
      error(res, err.message, 400)
      return
    }
    handleError(res, err, 'deleteMenu')
  }
}

// Export all functions as a controller object
export const menuController = {
  getMenu,
  getMenus,
  getMenuTree,
  createMenu,
  updateMenu,
  deleteMenu
}
