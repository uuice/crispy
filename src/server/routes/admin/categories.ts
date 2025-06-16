import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import { categoryService } from '../../services/categoryService'

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

    const category = await categoryService.getCategoryById(id)

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

    // Get filters from query
    const filters = {
      title: req.query['title'] as string | undefined,
      alias: req.query['alias'] as string | undefined,
      parent_id: req.query['parent_id'] ? parseInt(req.query['parent_id'] as string) : undefined,
      status: req.query['status'] ? parseInt(req.query['status'] as string) : undefined
    }

    const result = await categoryService.getCategories(filters, { page, pageSize })

    success(res, result)
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
    const tree = await categoryService.getCategoryTree()

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

    const result = await categoryService.createCategory(validatedData)

    success(res, result, 'Category created successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    if (err instanceof Error && err.message === 'Parent category not found') {
      error(res, 'Parent category not found', 400)
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

    const result = await categoryService.updateCategory(id, validatedData)

    if (!result.success) {
      notFound(res, 'Category not found')
      return
    }

    success(res, { id, ...validatedData }, 'Category updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    if (err instanceof Error) {
      if (err.message === 'Parent category not found') {
        error(res, 'Parent category not found', 400)
        return
      }
      if (err.message === 'Category cannot be its own parent') {
        error(res, 'Category cannot be its own parent', 400)
        return
      }
      if (err.message === 'Circular reference detected') {
        error(res, 'Circular reference detected', 400)
        return
      }
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

    const result = await categoryService.deleteCategory(id)

    if (!result.success) {
      notFound(res, 'Category not found')
      return
    }

    success(res, null, 'Category deleted successfully')
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Cannot delete category with children') {
      error(res, 'Cannot delete category with children', 400)
      return
    }
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
