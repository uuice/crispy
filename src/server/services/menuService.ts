import { db } from '@src/libs/db'
import { sql } from 'kysely'

// Data interfaces
export interface CreateMenuData {
  title: string
  alias: string
  parent_id: number
  icon?: string
  url?: string
  image_url?: string
  method?: string
  sort: number
  status: number
}

export type UpdateMenuData = Partial<CreateMenuData>

export interface MenuFilters {
  title?: string
  alias?: string
  parentId?: number
  status?: number
  startTime?: number
  endTime?: number
}

export interface MenuPaginationParams {
  page: number
  pageSize: number
}

export interface Menu {
  id: number
  title: string
  alias: string
  parent_id: number
  icon?: string
  url?: string
  image_url?: string
  method?: string
  sort: number
  status: number
  create_time: number
  update_time: number
  is_delete: number
  children?: Menu[]
}

export interface PaginatedMenusResult {
  data: Menu[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export class MenuService {
  /**
   * Get single menu by ID
   */
  async getMenuById(id: number): Promise<Menu | null> {
    const result = await db
      .selectFrom('menus')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return result as Menu | null
  }

  /**
   * Get menus list with pagination and filters
   */
  async getMenus(
    pagination: MenuPaginationParams,
    filters?: MenuFilters
  ): Promise<PaginatedMenusResult> {
    const { page, pageSize } = pagination
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('menus').selectAll().where('is_delete', '=', 0)

    // Apply filters
    if (filters) {
      if (filters.title) {
        query = query.where('title', 'like', `%${filters.title}%`)
      }
      if (filters.alias) {
        query = query.where('alias', 'like', `%${filters.alias}%`)
      }
      if (filters.parentId !== undefined) {
        query = query.where('parent_id', '=', filters.parentId)
      }
      if (filters.status !== undefined) {
        query = query.where('status', '=', filters.status)
      }
      if (filters.startTime) {
        query = query.where('create_time', '>=', filters.startTime)
      }
      if (filters.endTime) {
        query = query.where('create_time', '<=', filters.endTime)
      }
    }

    // Order by sort asc, create_time desc by default
    query = query.orderBy('sort', 'asc').orderBy('create_time', 'desc')

    const [menus, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    return {
      data: menus as Menu[],
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Get menu tree structure
   */
  async getMenuTree(): Promise<Menu[]> {
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

    return menuTree
  }

  /**
   * Create new menu
   */
  async createMenu(data: CreateMenuData): Promise<Menu> {
    // If parent_id is provided, verify that the parent menu exists
    if (data.parent_id !== 0) {
      const parentMenu = await this.getMenuById(data.parent_id)
      if (!parentMenu) {
        throw new Error('Parent menu not found')
      }
    }

    const now = Date.now()
    const newMenu = {
      ...data,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.safeInsertInto('menus').values(newMenu).executeTakeFirst()

    return {
      id: Number(result.insertId),
      ...newMenu
    }
  }

  /**
   * Update menu by ID
   */
  async updateMenu(id: number, data: UpdateMenuData): Promise<boolean> {
    // If parent_id is being updated, verify that the new parent menu exists
    if (data.parent_id !== undefined && data.parent_id !== 0) {
      const parentMenu = await this.getMenuById(data.parent_id)
      if (!parentMenu) {
        throw new Error('Parent menu not found')
      }

      // Prevent circular reference
      if (data.parent_id === id) {
        throw new Error('Menu cannot be its own parent')
      }
    }

    const updateData = {
      ...data,
      update_time: Date.now()
    }

    const result = await db
      .safeUpdateTable('menus')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return result.numUpdatedRows > 0n
  }

  /**
   * Delete menu (logical delete)
   */
  async deleteMenu(id: number): Promise<boolean> {
    // Check if menu has children
    const hasChildren = await this.menuHasChildren(id)
    if (hasChildren) {
      throw new Error('Cannot delete menu with children')
    }

    const result = await db
      .safeUpdateTable('menus')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return result.numUpdatedRows > 0n
  }

  /**
   * Get menus by status
   */
  async getMenusByStatus(status: number): Promise<Menu[]> {
    const result = await db
      .selectFrom('menus')
      .selectAll()
      .where('status', '=', status)
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()

    return result as Menu[]
  }

  /**
   * Get menus by parent ID
   */
  async getMenusByParentId(parentId: number): Promise<Menu[]> {
    const result = await db
      .selectFrom('menus')
      .selectAll()
      .where('parent_id', '=', parentId)
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()

    return result as Menu[]
  }

  /**
   * Get root menus (parent_id = 0)
   */
  async getRootMenus(): Promise<Menu[]> {
    return await this.getMenusByParentId(0)
  }

  /**
   * Search menus by title or alias
   */
  async searchMenus(searchTerm: string): Promise<Menu[]> {
    const result = await db
      .selectFrom('menus')
      .selectAll()
      .where('is_delete', '=', 0)
      .where((eb) =>
        eb.or([eb('title', 'like', `%${searchTerm}%`), eb('alias', 'like', `%${searchTerm}%`)])
      )
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()

    return result as Menu[]
  }

  /**
   * Check if menu has children
   */
  async menuHasChildren(id: number): Promise<boolean> {
    const result = await db
      .selectFrom('menus')
      .select('id')
      .where('parent_id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return !!result
  }

  /**
   * Get menu path (breadcrumb)
   */
  async getMenuPath(id: number): Promise<Menu[]> {
    const path: Menu[] = []
    let currentId = id

    while (currentId > 0) {
      const menu = await this.getMenuById(currentId)
      if (!menu) break

      path.unshift(menu)
      currentId = menu.parent_id
    }

    return path
  }

  /**
   * Get menus count by status
   */
  async getMenusCountByStatus(): Promise<{ status: number; count: number }[]> {
    return await db
      .selectFrom('menus')
      .select(['status', sql<number>`count(*)`.as('count')])
      .where('is_delete', '=', 0)
      .groupBy('status')
      .execute()
  }

  /**
   * Get menus count by parent
   */
  async getMenusCountByParent(): Promise<{ parent_id: number; count: number }[]> {
    return await db
      .selectFrom('menus')
      .select(['parent_id', sql<number>`count(*)`.as('count')])
      .where('is_delete', '=', 0)
      .groupBy('parent_id')
      .execute()
  }

  /**
   * Check if menu exists by alias
   */
  async checkMenuExistsByAlias(alias: string, excludeId?: number): Promise<boolean> {
    let query = db
      .selectFrom('menus')
      .select('id')
      .where('alias', '=', alias)
      .where('is_delete', '=', 0)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    const result = await query.executeTakeFirst()
    return !!result
  }

  /**
   * Get menus statistics
   */
  async getMenusStats(): Promise<{
    total: number
    active: number
    inactive: number
    deleted: number
    rootMenus: number
    childMenus: number
  }> {
    const stats = await db
      .selectFrom('menus')
      .select([
        sql<number>`count(*)`.as('total'),
        sql<number>`sum(case when status = 10 then 1 else 0 end)`.as('active'),
        sql<number>`sum(case when status = 0 then 1 else 0 end)`.as('inactive'),
        sql<number>`sum(case when is_delete = 10 then 1 else 0 end)`.as('deleted'),
        sql<number>`sum(case when parent_id = 0 then 1 else 0 end)`.as('rootMenus'),
        sql<number>`sum(case when parent_id > 0 then 1 else 0 end)`.as('childMenus')
      ])
      .executeTakeFirst()

    return {
      total: Number(stats?.total) || 0,
      active: Number(stats?.active) || 0,
      inactive: Number(stats?.inactive) || 0,
      deleted: Number(stats?.deleted) || 0,
      rootMenus: Number(stats?.rootMenus) || 0,
      childMenus: Number(stats?.childMenus) || 0
    }
  }
}

// Export singleton instance
export const menuService = new MenuService()
