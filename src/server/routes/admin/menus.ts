import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import {
  menuService,
  CreateMenuData,
  UpdateMenuData,
  MenuFilters
} from '../../services/menuService'

// Validation schemas
const createMenuSchema = z.object({
  title: z.string().min(1),
  alias: z.string().min(1),
  parent_id: z.number().default(0),
  icon: z.string().optional(),
  url: z.string().optional(),
  image_url: z.string().optional(),
  method: z.string().optional(),
  sort: z.number().default(0),
  status: z.number().default(10)
})

const updateMenuSchema = createMenuSchema.partial()

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

    // Build filters from query
    const filters: MenuFilters = {}
    if (req.query['title']) {
      filters.title = req.query['title'] as string
    }
    if (req.query['alias']) {
      filters.alias = req.query['alias'] as string
    }
    if (req.query['parent_id']) {
      filters.parentId = parseInt(req.query['parent_id'] as string)
    }
    if (req.query['status']) {
      filters.status = parseInt(req.query['status'] as string)
    }
    if (req.query['start_time']) {
      filters.startTime = parseInt(req.query['start_time'] as string)
    }
    if (req.query['end_time']) {
      filters.endTime = parseInt(req.query['end_time'] as string)
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

// Create new menu
export const createMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createMenuSchema.parse(req.body) as CreateMenuData

    const newMenu = await menuService.createMenu(validatedData)
    success(res, newMenu, 'Menu created successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    if (err instanceof Error) {
      error(res, err.message, 400)
      return
    }
    console.error('Error creating menu:', err)
    error(res, 'Internal server error')
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
      error(res, 'Invalid ID', 400)
      return
    }

    const validatedData = updateMenuSchema.parse(req.body) as UpdateMenuData

    const updated = await menuService.updateMenu(id, validatedData)

    if (!updated) {
      notFound(res, 'Menu not found')
      return
    }

    success(res, { id, ...validatedData }, 'Menu updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    if (err instanceof Error) {
      error(res, err.message, 400)
      return
    }
    console.error('Error updating menu:', err)
    error(res, 'Internal server error')
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
      error(res, 'Invalid ID', 400)
      return
    }

    const deleted = await menuService.deleteMenu(id)

    if (!deleted) {
      notFound(res, 'Menu not found')
      return
    }

    success(res, null, 'Menu deleted successfully')
  } catch (err: unknown) {
    if (err instanceof Error) {
      error(res, err.message, 400)
      return
    }
    console.error('Error deleting menu:', err)
    error(res, 'Internal server error')
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
