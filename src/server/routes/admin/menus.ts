import { db } from '@src/libs/db'
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'

// Validation schemas
const createMenuSchema = z.object({
  title: z.string().min(1),
  alias: z.string().min(1),
  des: z.string().optional(),
  parent_id: z.number().default(0),
  icon: z.string().optional(),
  url: z.string().optional(),
  sort: z.number().default(0),
  status: z.number().default(10)
})

const updateMenuSchema = createMenuSchema.partial()

// Define menu type
interface Menu {
  id: number
  title: string
  alias: string
  des?: string
  parent_id: number
  icon?: string
  url?: string
  sort: number
  status: number
  create_time: number
  update_time: number
  is_delete: number
  children?: Menu[]
}

// Get single menu
export const getMenu = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const menu = await db
      .selectFrom('menus')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

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
    const offset = (page - 1) * pageSize

    // Get filters from query
    const title = req.query['title'] as string | undefined
    const alias = req.query['alias'] as string | undefined
    const parentId = req.query['parent_id'] ? parseInt(req.query['parent_id'] as string) : undefined
    const status = req.query['status'] ? parseInt(req.query['status'] as string) : undefined
    const startTime = req.query['start_time']
      ? parseInt(req.query['start_time'] as string)
      : undefined
    const endTime = req.query['end_time'] ? parseInt(req.query['end_time'] as string) : undefined

    let query = db.selectFrom('menus').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (title) {
      query = query.where('title', 'like', `%${title}%`)
    }
    if (alias) {
      query = query.where('alias', 'like', `%${alias}%`)
    }
    if (parentId !== undefined && !isNaN(parentId)) {
      query = query.where('parent_id', '=', parentId)
    }
    if (status !== undefined && !isNaN(status)) {
      query = query.where('status', '=', status)
    }
    if (startTime) {
      query = query.where('create_time', '>=', startTime)
    }
    if (endTime) {
      query = query.where('create_time', '<=', endTime)
    }

    // Order by sort asc, create_time desc by default
    query = query.orderBy('sort', 'asc').orderBy('create_time', 'desc')

    const [menus, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    success(res, {
      data: menus,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    })
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
    const menus = await db
      .selectFrom('menus')
      .selectAll()
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()

    // Build menu tree
    const menuMap = new Map<number, Menu>()
    const menuTree: Menu[] = []

    // First pass: create a map of all menus
    menus.forEach((menu) => {
      menuMap.set(menu.id, { ...menu, children: [] })
    })

    // Second pass: build the tree structure
    menus.forEach((menu) => {
      const menuWithChildren = menuMap.get(menu.id)
      if (!menuWithChildren) return

      if (menu.parent_id === 0) {
        menuTree.push(menuWithChildren)
      } else {
        const parent = menuMap.get(menu.parent_id)
        if (parent) {
          if (!parent.children) {
            parent.children = []
          }
          parent.children.push(menuWithChildren)
        }
      }
    })

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
    const validatedData = createMenuSchema.parse(req.body)

    // If parent_id is provided, verify that the parent menu exists
    if (validatedData.parent_id !== 0) {
      const parentMenu = await db
        .selectFrom('menus')
        .select('id')
        .where('id', '=', validatedData.parent_id)
        .where('is_delete', '=', 0)
        .executeTakeFirst()

      if (!parentMenu) {
        error(res, 'Parent menu not found', 400)
        return
      }
    }

    const now = Date.now()
    const newMenu = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.insertInto('menus').values(newMenu).executeTakeFirst()

    success(
      res,
      {
        id: Number(result.insertId),
        ...newMenu
      },
      'Menu created successfully'
    )
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
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

    const validatedData = updateMenuSchema.parse(req.body)

    // If parent_id is being updated, verify that the new parent menu exists
    if (validatedData.parent_id !== undefined && validatedData.parent_id !== 0) {
      const parentMenu = await db
        .selectFrom('menus')
        .select('id')
        .where('id', '=', validatedData.parent_id)
        .where('is_delete', '=', 0)
        .executeTakeFirst()

      if (!parentMenu) {
        error(res, 'Parent menu not found', 400)
        return
      }

      // Prevent circular reference
      if (validatedData.parent_id === id) {
        error(res, 'Menu cannot be its own parent', 400)
        return
      }
    }

    const updateData = {
      ...validatedData,
      update_time: Date.now()
    }

    const result = await db
      .updateTable('menus')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Menu not found')
      return
    }

    success(res, { id, ...updateData }, 'Menu updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
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

    // Check if menu has children
    const hasChildren = await db
      .selectFrom('menus')
      .select('id')
      .where('parent_id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (hasChildren) {
      error(res, 'Cannot delete menu with children', 400)
      return
    }

    const result = await db
      .updateTable('menus')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Menu not found')
      return
    }

    success(res, null, 'Menu deleted successfully')
  } catch (err: unknown) {
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
