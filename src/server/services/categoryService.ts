import { db } from '@src/libs/db'
import { sql } from 'kysely'
import { DELETE_STATUS } from '../config/const'

export interface CreateCategoryData {
  title: string
  alias: string
  des?: string
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
  dataList: T[]
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
      dataList: categories,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Recursively builds a subtree for a given parent ID.
   */
  private async buildSubTree(parentId: number): Promise<CategoryNode[]> {
    const children = await db
      .selectFrom('categories')
      .selectAll()
      .where('parent_id', '=', parentId)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()

    if (children.length === 0) {
      return []
    }

    return Promise.all(
      children.map(async (child) => ({
        ...(child as any),
        children: await this.buildSubTree(child.id)
      }))
    )
  }

  /**
   * Get category tree structure.
   * If rootId or rootAlias is provided, it returns the subtree starting from that category.
   * Otherwise, it returns the full category tree.
   */
  async getCategoryTree(options?: {
    rootId?: number
    rootAlias?: string
  }): Promise<CategoryNode[]> {
    console.log('options', options)
    // If a root is specified, build the subtree from there
    if (options?.rootId || options?.rootAlias) {
      let rootCategory
      if (options.rootId) {
        rootCategory = await this.getCategoryById(options.rootId)
      } else if (options.rootAlias) {
        rootCategory = await this.getCategoryByAlias(options.rootAlias)
      }

      if (!rootCategory) {
        return [] // Root not found, return empty tree
      }

      // Recursively fetch children for the root
      const children = await this.buildSubTree(rootCategory.id)

      return [
        {
          ...(rootCategory as any),
          children
        }
      ]
    }

    // Recursively build the full tree starting from the root (parent_id = 0)
    return this.buildSubTree(0)
  }

  /**
   * Verify that a parent category exists
   */
  async verifyParentExists(parentId: number) {
    return await db
      .selectFrom('categories')
      .select('id')
      .where('id', '=', parentId)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
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
        .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
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
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
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
        throw new Error('父级分类不存在')
      }
    }

    const now = Date.now()
    const newCategory = {
      title: data.title,
      alias: data.alias || '',
      des: data.des || '',
      parent_id: data.parent_id || 0,
      sort: data.sort || 0,
      status: data.status || 10,
      create_time: now,
      update_time: now,
      is_delete: DELETE_STATUS.UN_DELETE
    }

    const result = await db.safeInsertInto('categories').values(newCategory).executeTakeFirst()

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
        throw new Error('分类不能是自己的父级')
      }

      const parent = await this.verifyParentExists(data.parent_id)
      if (!parent) {
        throw new Error('父级分类不存在')
      }

      // Check for circular reference
      const hasCircularReference = await this.checkCircularReference(id, data.parent_id)
      if (hasCircularReference) {
        throw new Error('循环引用检测到')
      }
    }

    const updateData = {
      ...data,
      update_time: Date.now()
    }

    const result = await db
      .safeUpdateTable('categories')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
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
      .safeUpdateTable('categories')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
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
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
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
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get category by alias
   */
  async getCategoryByAlias(alias: string) {
    console.log('alias', alias)
    return await db
      .selectFrom('categories')
      .selectAll()
      .where('alias', '=', alias)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
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
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    return await query.executeTakeFirst()
  }

  /**
   * Get category path (breadcrumb)
   */
  async getCategoryPath(categoryId: number): Promise<any[]> {
    const path: any = []
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

  // 获取所有分类
  async getAllCategories(): Promise<any[]> {
    return await db.selectFrom('categories').selectAll().where('is_delete', '=', 0).execute()
  }
}

export const categoryService = new CategoryService()
