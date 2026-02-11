import { db } from '@src/libs/db'
import { sql } from 'kysely'
import { DELETE_STATUS } from '../config/const'
import {
  CategoryEntity,
  CategoryEntityNested,
  CategoryFilters,
  CreateCategory,
  createCategorySchema,
  CreateSuccess,
  PaginatedResult,
  UpdateCategory,
  updateCategorySchema,
  UpdateSuccess
} from '@src/types'

export class CategoryService {
  /**
   * Get a single category by ID
   * @param id Category id
   * @returns Category or null if not found
   */
  async getCategoryById(id: number): Promise<CategoryEntity | null> {
    const category = await db
      .selectFrom('categories')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return category || null
  }

  /**
   * Get categories with pagination and filters
   * @param filters Filter options
   * @param options Pagination options
   * @returns List of categories and pagination info
   */
  async getCategories(filters: CategoryFilters): Promise<PaginatedResult<CategoryEntity>> {
    const page = Number(filters.page) || 1
    const pageSize = Number(filters.pageSize) || 10
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('categories').selectAll()

    // Apply filters
    if (filters.title) {
      query = query.where('title', 'like', `%${filters.title}%`)
    }

    if (filters.alias) {
      query = query.where('alias', 'like', `%${filters.alias}%`)
    }

    if (filters.des) {
      query = query.where('des', 'like', `%${filters.des}%`)
    }

    if (filters.parent_id !== undefined) {
      query = query.where('parent_id', '=', filters.parent_id)
    }

    if (filters.status !== undefined) {
      query = query.where('status', '=', filters.status)
    }

    // Default to only non-deleted categories
    query = query.where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    const [categories, total] = await Promise.all([
      query
        .orderBy('sort', 'asc')
        .orderBy('create_time', 'desc')
        .limit(pageSize)
        .offset(offset)
        .execute(),
      db
        .selectFrom('categories')
        .select((eb) => [eb.fn.count('id').as('count')])
        .$call((qb) => {
          // Apply same filters to count query
          if (filters.title) {
            qb = qb.where('title', 'like', `%${filters.title}%`)
          }
          if (filters.alias) {
            qb = qb.where('alias', 'like', `%${filters.alias}%`)
          }
          if (filters.des) {
            qb = qb.where('des', 'like', `%${filters.des}%`)
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
  private async buildSubTree(parentId: number): Promise<CategoryEntityNested[]> {
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
  }): Promise<CategoryEntityNested[]> {
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
   * @param parentId Parent category id
   * @returns true if exists
   */
  async verifyParentExists(parentId: number): Promise<boolean> {
    const parent = await db
      .selectFrom('categories')
      .select('id')
      .where('id', '=', parentId)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return !!parent
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
   * @param categoryId Category id
   * @returns true if has children
   */
  async hasChildren(categoryId: number): Promise<boolean> {
    const child = await db
      .selectFrom('categories')
      .select('id')
      .where('parent_id', '=', categoryId)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return !!child
  }

  /**
   * Create a new category
   * @param createData Category data without id
   * @returns Created category id
   */
  async create(createData: CreateCategory): Promise<CreateSuccess> {
    // 验证
    const validatedData = createCategorySchema.parse(createData)
    // If parent_id is provided, verify that the parent exists
    if (validatedData.parent_id) {
      const parent = await this.verifyParentExists(validatedData.parent_id)
      if (!parent) {
        throw new Error('父级分类不存在')
      }
    }

    const now = Date.now()
    const newCategory = {
      title: validatedData.title,
      alias: validatedData.alias,
      des: validatedData.des || '',
      parent_id: validatedData.parent_id || 0,
      sort: validatedData.sort || 0,
      status: validatedData.status || 10,
      create_time: now,
      update_time: now,
      is_delete: DELETE_STATUS.UN_DELETE
    }

    const result = await db.insertInto('categories').values(newCategory).executeTakeFirst()
    if (!result) throw new Error('创建分类失败')
    return { id: Number(result.insertId) }
  }

  /**
   * Update a category
   * @param id Category id
   * @param updateData Data to update
   * @returns Updated category id
   */
  async update(id: number, updateData: UpdateCategory): Promise<UpdateSuccess> {
    const validatedData = updateCategorySchema.parse(updateData)
    // If parent_id is being updated, verify that the new parent exists and is not a descendant
    if (validatedData.parent_id) {
      if (validatedData.parent_id === id) {
        throw new Error('分类不能是自己的父级')
      }

      const parent = await this.verifyParentExists(validatedData.parent_id)
      if (!parent) {
        throw new Error('父级分类不存在')
      }

      // Check for circular reference
      const hasCircularReference = await this.checkCircularReference(id, validatedData.parent_id)
      if (hasCircularReference) {
        throw new Error('循环引用检测到')
      }
    }

    const result = await db
      .updateTable('categories')
      .set({
        ...validatedData,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!result) throw new Error('更新分类失败')
    return { id }
  }

  /**
   * Soft delete category
   * @param id Category id
   * @returns true if deleted successfully
   */
  async delete(id: number): Promise<boolean> {
    // Check if category has children
    const hasChildren = await this.hasChildren(id)
    if (hasChildren) {
      throw new Error('无法删除有子分类的分类')
    }

    const result = await db
      .updateTable('categories')
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
   * Get categories by parent ID
   * @param parentId Parent category id
   * @param limit Max number of results
   * @returns List of categories
   */
  async getCategoriesByParent(parentId: number, limit = 10): Promise<CategoryEntity[]> {
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
   * @param limit Max number of results
   * @returns List of root categories
   */
  async getRootCategories(limit = 10): Promise<CategoryEntity[]> {
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
   * @param alias Category alias
   * @returns Category or null if not found
   */
  async getCategoryByAlias(alias: string): Promise<CategoryEntity | null> {
    const category = await db
      .selectFrom('categories')
      .selectAll()
      .where('alias', '=', alias)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return category || null
  }

  /**
   * Check if category title already exists
   * @param title Category title
   * @param excludeId Category id to exclude from check
   * @returns true if exists
   */
  async checkTitleExists(title: string, excludeId?: number): Promise<boolean> {
    let query = db
      .selectFrom('categories')
      .select('id')
      .where('title', '=', title)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    const category = await query.executeTakeFirst()
    return !!category
  }

  /**
   * Get category path (breadcrumb)
   * @param categoryId Category id
   * @returns List of categories from root to current
   */
  async getCategoryPath(categoryId: number): Promise<CategoryEntity[]> {
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

  /**
   * Get categories with article count
   * @param parentAlias Parent category alias
   * @returns List of categories with article count
   */
  async getCategoriesWithArticleCount(parentAlias?: string): Promise<any[]> {
    let query = db
      .selectFrom('categories as c')
      .leftJoin('articles as a', (join) =>
        join
          .onRef('c.id', '=', 'a.type_id')
          .on('a.status', '=', 10) // Published articles only
          .on('a.is_delete', '=', 0)
      )
      .select([
        'c.id',
        'c.title',
        'c.alias',
        'c.des',
        'c.parent_id',
        'c.sort',
        'c.status',
        'c.create_time',
        'c.update_time',
        sql<number>`COUNT(DISTINCT a.id)`.as('article_count')
      ])
      .where('c.is_delete', '=', 0)
      .where('c.status', '=', 10) // Published categories only
      .groupBy([
        'c.id',
        'c.title',
        'c.alias',
        'c.des',
        'c.parent_id',
        'c.sort',
        'c.status',
        'c.create_time',
        'c.update_time'
      ])

    // If parentAlias is provided, filter by parent category
    if (parentAlias) {
      const parentCategory = await this.getCategoryByAlias(parentAlias)
      if (parentCategory) {
        query = query.where('c.parent_id', '=', parentCategory.id)
      }
    }

    return await query.orderBy('c.sort', 'asc').orderBy('c.create_time', 'desc').execute()
  }

  /**
   * Get all categories
   * @returns List of all categories
   */
  async getAllCategories(): Promise<CategoryEntity[]> {
    return await db
      .selectFrom('categories')
      .selectAll()
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .execute()
  }
}

export const categoryService = new CategoryService()
