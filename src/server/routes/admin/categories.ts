import { db } from '@src/libs/db'
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import { sql } from 'kysely'

// Validation schemas
const createCategorySchema = z.object({
  title: z.string().min(1),
  alias: z.string().optional(),
  des: z.string(), // 备注描述，必填
  parent_id: z.number().optional(),
  sort: z.number().default(0),
  status: z.number().default(10)
})

const updateCategorySchema = createCategorySchema.partial()

// Get single category
export const getCategory = async (
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

    const category = await db
      .selectFrom('categories')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!category) {
      notFound(res, 'Category not found')
      return
    }

    success(res, category)
  } catch (err: unknown) {
    console.error('Error fetching category:', err)
    error(res, 'Internal server error')
  }
}

// Get categories list with pagination
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10
    const offset = (page - 1) * pageSize

    // Get filters from query
    const title = req.query['title'] as string | undefined
    const alias = req.query['alias'] as string | undefined
    const parentId = req.query['parent_id'] ? parseInt(req.query['parent_id'] as string) : undefined
    const status = req.query['status'] ? parseInt(req.query['status'] as string) : undefined

    let query = db.selectFrom('categories').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (title) {
      query = query.where(sql.ref('title'), 'like', `%${title}%`)
    }
    if (alias) {
      query = query.where(sql.ref('alias'), 'like', `%${alias}%`)
    }
    if (parentId !== undefined && !isNaN(parentId)) {
      query = query.where(sql.ref('parent_id'), '=', parentId)
    }
    if (status !== undefined && !isNaN(status)) {
      query = query.where(sql.ref('status'), '=', status)
    }

    // Order by sort and create_time
    query = query.orderBy('sort', 'asc').orderBy('create_time', 'desc')

    const [categories, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    success(res, {
      data: categories,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    })
  } catch (err: unknown) {
    console.error('Error fetching categories:', err)
    error(res, 'Internal server error')
  }
}

// Get category tree
export const getCategoryTree = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
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
    const tree = []

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

    success(res, tree)
  } catch (err: unknown) {
    console.error('Error fetching category tree:', err)
    error(res, 'Internal server error')
  }
}

// Create new category
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createCategorySchema.parse(req.body)

    // If parent_id is provided, verify that the parent exists
    if (validatedData.parent_id) {
      const parent = await db
        .selectFrom('categories')
        .select('id')
        .where('id', '=', validatedData.parent_id)
        .where('is_delete', '=', 0)
        .executeTakeFirst()

      if (!parent) {
        error(res, 'Parent category not found', 400)
        return
      }
    }

    const now = Date.now()
    const newCategory = {
      title: validatedData.title,
      alias: validatedData.alias || '',
      des: validatedData.des,
      parent_id: validatedData.parent_id || 0,
      sort: validatedData.sort,
      status: validatedData.status,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.insertInto('categories').values(newCategory).executeTakeFirst()

    success(
      res,
      {
        id: Number(result.insertId),
        ...newCategory
      },
      'Category created successfully'
    )
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error creating category:', err)
    error(res, 'Internal server error')
  }
}

// Update category
export const updateCategory = async (
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

    const validatedData = updateCategorySchema.parse(req.body)

    // If parent_id is being updated, verify that the new parent exists and is not a descendant
    if (validatedData.parent_id !== undefined) {
      if (validatedData.parent_id === id) {
        error(res, 'Category cannot be its own parent', 400)
        return
      }

      const parent = await db
        .selectFrom('categories')
        .select('id')
        .where('id', '=', validatedData.parent_id)
        .where('is_delete', '=', 0)
        .executeTakeFirst()

      if (!parent) {
        error(res, 'Parent category not found', 400)
        return
      }

      // Check for circular reference
      let currentParentId = validatedData.parent_id
      while (currentParentId) {
        if (currentParentId === id) {
          error(res, 'Circular reference detected', 400)
          return
        }
        const currentParent = await db
          .selectFrom('categories')
          .select('parent_id')
          .where('id', '=', currentParentId)
          .where('is_delete', '=', 0)
          .executeTakeFirst()
        currentParentId = currentParent?.parent_id || 0
      }
    }

    const updateData = {
      ...validatedData,
      update_time: Date.now()
    }

    const result = await db
      .updateTable('categories')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Category not found')
      return
    }

    success(res, { id, ...updateData }, 'Category updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error updating category:', err)
    error(res, 'Internal server error')
  }
}

// Delete category (logical delete)
export const deleteCategory = async (
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

    // Check if category has children
    const hasChildren = await db
      .selectFrom('categories')
      .select('id')
      .where('parent_id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (hasChildren) {
      error(res, 'Cannot delete category with children', 400)
      return
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

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Category not found')
      return
    }

    success(res, null, 'Category deleted successfully')
  } catch (err: unknown) {
    console.error('Error deleting category:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const categoryController = {
  getCategory,
  getCategories,
  getCategoryTree,
  createCategory,
  updateCategory,
  deleteCategory
}
