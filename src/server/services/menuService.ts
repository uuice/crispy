import { db } from '@src/libs/db'
import { DELETE_STATUS } from '../config/const'
import {
  CreateMenu,
  createMenuSchema,
  CreateSuccess,
  MenuEntity,
  MenuFilters,
  MenuTreeItem,
  PaginatedResult,
  UpdateMenu,
  updateMenuSchema,
  UpdateSuccess
} from '@src/types'

export class MenuService {
  /**
   * Get single menu by ID
   */
  async getById(id: number): Promise<MenuEntity | null> {
    const menu = await db
      .selectFrom('menus')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    return menu || null
  }

  /**
   * Get menus list with pagination and filters
   */
  async getMenus(filters: MenuFilters): Promise<PaginatedResult<MenuEntity>> {
    const page = Number(filters.page) || 1
    const pageSize = Number(filters.pageSize) || 10
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('menus').selectAll()

    // Apply filters
    if (filters.title) {
      query = query.where('title', 'like', `%${filters.title}%`)
    }
    if (filters.alias) {
      query = query.where('alias', 'like', `%${filters.alias}%`)
    }
    if (filters.parent_id !== undefined) {
      query = query.where('parent_id', '=', filters.parent_id)
    }
    if (filters.status !== undefined) {
      query = query.where('status', '=', filters.status)
    }

    query = query.where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    const [menus, total] = await Promise.all([
      query
        .orderBy('sort', 'asc')
        .orderBy('create_time', 'desc')
        .limit(pageSize)
        .offset(offset)
        .execute(),
      db
        .selectFrom('menus')
        .select((eb) => [eb.fn.count('id').as('count')])
        .$call((qb) => {
          if (filters.title) {
            qb = qb.where('title', 'like', `%${filters.title}%`)
          }
          if (filters.alias) {
            qb = qb.where('alias', 'like', `%${filters.alias}%`)
          }
          if (filters.parent_id !== undefined) {
            qb = qb.where('parent_id', '=', filters.parent_id)
          }
          if (filters.status !== undefined) {
            qb = qb.where('status', '=', filters.status)
          }
          qb = qb.where('is_delete', '=', DELETE_STATUS.UN_DELETE)
          return qb
        })
        .executeTakeFirst()
    ])

    return {
      dataList: menus,
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
  async getMenuTree(): Promise<MenuTreeItem[]> {
    const menus = await db
      .selectFrom('menus')
      .selectAll()
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()

    // Build menu tree
    const menuMap = new Map<number, MenuTreeItem>()
    const menuTree: MenuTreeItem[] = []

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
  async create(createData: CreateMenu): Promise<CreateSuccess> {
    const validatedData = createMenuSchema.parse(createData)

    // If parent_id is provided, verify that the parent menu exists
    if (validatedData.parent_id && validatedData.parent_id !== 0) {
      const parentMenu = await this.getById(validatedData.parent_id)
      if (!parentMenu) {
        throw new Error('Parent menu not found')
      }
    }

    const now = Date.now()
    const newMenu = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: DELETE_STATUS.UN_DELETE
    }

    const result = await db.insertInto('menus').values(newMenu).executeTakeFirst()
    if (!result) throw new Error('创建菜单失败')
    return { id: Number(result.insertId) }
  }

  /**
   * Update menu by ID
   */
  async update(id: number, updateData: UpdateMenu): Promise<UpdateSuccess> {
    const validatedData = updateMenuSchema.parse(updateData)

    // If parent_id is being updated, verify that the new parent menu exists
    if (validatedData.parent_id !== undefined && validatedData.parent_id !== 0) {
      const parentMenu = await this.getById(validatedData.parent_id)
      if (!parentMenu) {
        throw new Error('Parent menu not found')
      }

      // Prevent circular reference
      if (validatedData.parent_id === id) {
        throw new Error('Menu cannot be its own parent')
      }
    }

    const result = await db
      .updateTable('menus')
      .set({ ...validatedData, update_time: Date.now() })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!result) throw new Error('更新菜单失败')
    return { id }
  }

  /**
   * Delete menu (logical delete)
   */
  async delete(id: number): Promise<boolean> {
    // Check if menu has children
    const hasChildren = await this.menuHasChildren(id)
    if (hasChildren) {
      throw new Error('Cannot delete menu with children')
    }

    const result = await db
      .updateTable('menus')
      .set({
        is_delete: DELETE_STATUS.DELETE,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    return Number(result.numUpdatedRows) > 0
  }

  /**
   * Get menus by status
   */
  async getMenusByStatus(status: number): Promise<MenuEntity[]> {
    const menus = await db
      .selectFrom('menus')
      .selectAll()
      .where('status', '=', status)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()

    return menus
  }

  /**
   * Get menus by parent ID
   */
  async getMenusByParentId(parentId: number): Promise<MenuEntity[]> {
    const menus = await db
      .selectFrom('menus')
      .selectAll()
      .where('parent_id', '=', parentId)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()

    return menus
  }

  /**
   * Get root menus (parent_id = 0)
   */
  async getRootMenus(): Promise<MenuEntity[]> {
    return await this.getMenusByParentId(0)
  }

  /**
   * Search menus by title or alias
   */
  async searchMenus(searchTerm: string): Promise<MenuEntity[]> {
    const menus = await db
      .selectFrom('menus')
      .selectAll()
      .where((eb) =>
        eb.or([eb('title', 'like', `%${searchTerm}%`), eb('alias', 'like', `%${searchTerm}%`)])
      )
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()

    return menus
  }

  /**
   * Check if menu has children
   */
  async menuHasChildren(id: number): Promise<boolean> {
    const result = await db
      .selectFrom('menus')
      .select('id')
      .where('parent_id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    return !!result
  }

  /**
   * Get menu path (breadcrumb)
   */
  async getMenuPath(id: number): Promise<MenuEntity[]> {
    const path: MenuEntity[] = []
    let currentId = id

    while (currentId > 0) {
      const menu = await this.getById(currentId)
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
    const results = await db
      .selectFrom('menus')
      .select((eb) => ['status', eb.fn.count('id').as('count')])
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .groupBy('status')
      .execute()

    return results.map((r) => ({
      status: r.status,
      count: Number(r.count)
    }))
  }

  /**
   * Get menus count by parent
   */
  async getMenusCountByParent(): Promise<{ parent_id: number; count: number }[]> {
    const results = await db
      .selectFrom('menus')
      .select((eb) => ['parent_id', eb.fn.count('id').as('count')])
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .groupBy('parent_id')
      .execute()

    return results.map((r) => ({
      parent_id: r.parent_id,
      count: Number(r.count)
    }))
  }

  /**
   * Check if menu exists by alias
   */
  async checkMenuExistsByAlias(alias: string, excludeId?: number): Promise<boolean> {
    let query = db
      .selectFrom('menus')
      .select('id')
      .where('alias', '=', alias)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)

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
      .select((eb) => [
        eb.fn.count('id').as('total'),
        eb.fn.sum<number>(eb.case().when('status', '=', 10).then(1).else(0).end()).as('active'),
        eb.fn.sum<number>(eb.case().when('status', '=', 0).then(1).else(0).end()).as('inactive'),
        eb.fn
          .sum<number>(eb.case().when('is_delete', '=', DELETE_STATUS.DELETE).then(1).else(0).end())
          .as('deleted'),
        eb.fn
          .sum<number>(eb.case().when('parent_id', '=', 0).then(1).else(0).end())
          .as('rootMenus'),
        eb.fn
          .sum<number>(eb.case().when('parent_id', '>', 0).then(1).else(0).end())
          .as('childMenus')
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
