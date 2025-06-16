import { db } from '@src/libs/db'
import { sql } from 'kysely'

export interface CreateCategoryData {
  title: string
  alias?: string
  des: string // 备注描述，必填
  parent_id?: number
  sort?: number
  status?: number
}

export type UpdateCategoryData = Partial<CreateCategoryData>

export interface CategoryFilters {
  title?: string
  alias?: string
  parent_id?: number
  status?: number
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export interface CategoryNode {
  id: number
  title: string
  alias?: string
  des: string
  parent_id?: number
  sort?: number
  status?: number
  create_time: number
  update_time: number
  children: CategoryNode[]
}

export class CategoryService {
  /**
   * Get a single category by ID
   */
  async getCategoryById(id: number) {
    return await db
      .selectFrom('categories')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()
  }

  /**
   * Get categories with pagination and filters
   */
  async getCategories(
    filters: CategoryFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResult<any>> {
    const { page, pageSize } = pagination
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('categories').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (filters.title) {
      query = query.where(sql.ref('title'), 'like', `%${filters.title}%`)
    }
    if (filters.alias) {
      query = query.where(sql.ref('alias'), 'like', `%${filters.alias}%`)
    }
    if (filters.parent_id !== undefined && !isNaN(filters.parent_id)) {
      query = query.where(sql.ref('parent_id'), '=', filters.parent_id)
    }
    if (filters.status !== undefined && !isNaN(filters.status)) {
      query = query.where(sql.ref('status'), '=', filters.status)
    }

    // Order by sort and create_time
    query = query.orderBy('sort', 'asc').orderBy('create_time', 'desc')

    const [categories, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    return {
      data: categories,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Get category tree structure
   */
  async getCategoryTree(): Promise<CategoryNode[]> {
    const categories = await db
      .selectFrom('categories')
      .selectAll()
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()

    // Build tree structure
    const categoryMap = new Map()
    categories.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, children: [] })
    })
    const tree: CategoryNode[] = []

    for (const category of categoryMap.values()) {
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id)
        if (parent) {
          parent.children.push(category)
        }
      } else {
        tree.push(category)
      }
    }

    return tree
  }

  /**
   * Verify that a parent category exists
   */
  async verifyParentExists(parentId: number) {
    return await db
      .selectFrom('categories')
      .select('id')
      .where('id', '=', parentId)
      .where('is_delete', '=', 0)
      .executeTakeFirst()
  }

  /**
   * Check for circular reference in category hierarchy
   */
  async checkCircularReference(categoryId: number, newParentId: number): Promise<boolean> {
    if (newParentId === categoryId) {
      return true // Self-reference
    }

    let currentParentId = newParentId
    while (currentParentId) {
      if (currentParentId === categoryId) {
        return true // Circular reference detected
      }
      const currentParent = await db
        .selectFrom('categories')
        .select('parent_id')
        .where('id', '=', currentParentId)
        .where('is_delete', '=', 0)
        .executeTakeFirst()
      currentParentId = currentParent?.parent_id || 0
    }

    return false
  }

  /**
   * Check if category has children
   */
  async hasChildren(categoryId: number) {
    return await db
      .selectFrom('categories')
      .select('id')
      .where('parent_id', '=', categoryId)
      .where('is_delete', '=', 0)
      .executeTakeFirst()
  }

  /**
   * Create a new category
   */
  async createCategory(data: CreateCategoryData) {
    // If parent_id is provided, verify that the parent exists
    if (data.parent_id) {
      const parent = await this.verifyParentExists(data.parent_id)
      if (!parent) {
        throw new Error('Parent category not found')
      }
    }

    const now = Date.now()
    const newCategory = {
      title: data.title,
      alias: data.alias || '',
      des: data.des,
      parent_id: data.parent_id || 0,
      sort: data.sort || 0,
      status: data.status || 10,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.insertInto('categories').values(newCategory).executeTakeFirst()

    return {
      id: Number(result.insertId),
      ...newCategory
    }
  }

  /**
   * Update a category
   */
  async updateCategory(id: number, data: UpdateCategoryData) {
    // If parent_id is being updated, verify that the new parent exists and is not a descendant
    if (data.parent_id !== undefined) {
      if (data.parent_id === id) {
        throw new Error('Category cannot be its own parent')
      }

      const parent = await this.verifyParentExists(data.parent_id)
      if (!parent) {
        throw new Error('Parent category not found')
      }

      // Check for circular reference
      const hasCircularReference = await this.checkCircularReference(id, data.parent_id)
      if (hasCircularReference) {
        throw new Error('Circular reference detected')
      }
    }

    const updateData = {
      ...data,
      update_time: Date.now()
    }

    const result = await db
      .updateTable('categories')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return {
      success: result.numUpdatedRows > 0,
      numUpdatedRows: result.numUpdatedRows
    }
  }

  /**
   * Delete a category (logical delete)
   */
  async deleteCategory(id: number) {
    // Check if category has children
    const hasChildren = await this.hasChildren(id)
    if (hasChildren) {
      throw new Error('Cannot delete category with children')
    }

    const result = await db
      .updateTable('categories')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return {
      success: result.numUpdatedRows > 0,
      numUpdatedRows: result.numUpdatedRows
    }
  }

  /**
   * Get categories by parent ID
   */
  async getCategoriesByParent(parentId: number, limit = 10) {
    return await db
      .selectFrom('categories')
      .selectAll()
      .where('parent_id', '=', parentId)
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get root categories (parent_id = 0)
   */
  async getRootCategories(limit = 10) {
    return await db
      .selectFrom('categories')
      .selectAll()
      .where('parent_id', '=', 0)
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get category by alias
   */
  async getCategoryByAlias(alias: string) {
    return await db
      .selectFrom('categories')
      .selectAll()
      .where('alias', '=', alias)
      .where('is_delete', '=', 0)
      .executeTakeFirst()
  }

  /**
   * Check if category title already exists
   */
  async checkTitleExists(title: string, excludeId?: number) {
    let query = db
      .selectFrom('categories')
      .select('id')
      .where('title', '=', title)
      .where('is_delete', '=', 0)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    return await query.executeTakeFirst()
  }

  /**
   * Get category path (breadcrumb)
   */
  async getCategoryPath(categoryId: number): Promise<any[]> {
    const path = []
    let currentId = categoryId

    while (currentId) {
      const category = await this.getCategoryById(currentId)
      if (category) {
        path.unshift(category)
        currentId = category.parent_id || 0
      } else {
        break
      }
    }

    return path
  }
}

export const categoryService = new CategoryService()
