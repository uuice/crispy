import { NextFunction, Request, Response } from 'express'
import { error, notFound, success } from '../../utils/response'
import { menuService } from '../../services/menuService'

// Get single menu
export const getMenu = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const menu = await menuService.getMenuById(id)

    if (!menu) {
      notFound(res, 'Menu not found')
      return
    }

    success(res, menu)
  } catch (err: unknown) {
    console.error('Error fetching menu:', err)
    error(res, 'Internal server error')
  }
}

// Get menus list with pagination
export const getMenus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10

    const filters = {
      title: req.query['title'] as string | undefined,
      alias: req.query['alias'] as string | undefined,
      parent_id:
        req.query['parent_id'] !== undefined
          ? parseInt(req.query['parent_id'] as string)
          : undefined,
      icon: req.query['icon'] as string | undefined,
      url: req.query['url'] as string | undefined,
      image_url: req.query['image_url'] as string | undefined,
      method: req.query['method'] as string | undefined,
      sort: req.query['sort'] !== undefined ? parseInt(req.query['sort'] as string) : undefined,
      status:
        req.query['status'] !== undefined ? parseInt(req.query['status'] as string) : undefined,
      is_delete:
        req.query['is_delete'] !== undefined
          ? parseInt(req.query['is_delete'] as string)
          : undefined,
      update_time:
        req.query['update_time'] !== undefined
          ? parseInt(req.query['update_time'] as string)
          : undefined,
      create_time:
        req.query['create_time'] !== undefined
          ? parseInt(req.query['create_time'] as string)
          : undefined,
      start_time:
        req.query['start_time'] !== undefined
          ? parseInt(req.query['start_time'] as string)
          : undefined,
      end_time:
        req.query['end_time'] !== undefined ? parseInt(req.query['end_time'] as string) : undefined
    }
    const result = await menuService.getMenus({ page, pageSize }, filters)
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching menus:', err)
    error(res, 'Internal server error')
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
    console.error('Error fetching menu tree:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const menuController = {
  getMenu,
  getMenus,
  getMenuTree
}
