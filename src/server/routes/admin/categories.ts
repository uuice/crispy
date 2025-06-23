import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound, handleError } from '../../utils/response'
import { categoryService } from '../../services/categoryService'
import { SYSTEM_CATEGORY_ALIAS_MAP } from '@src/server/config/const'

// Validation schemas
const createCategorySchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  alias: z.string().min(1, '别名不能为空'),
  des: z.string().optional(), // 备注描述，必填
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
    handleError(res, err, 'getCategory')
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
    handleError(res, err, 'getCategories')
  }
}

// Get category tree
export const getCategoryTree = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, alias } = req.query
    const options = {
      rootId: id ? parseInt(id as string) : undefined,
      rootAlias: alias as string | undefined
    }
    if (alias) {
      options.rootAlias = SYSTEM_CATEGORY_ALIAS_MAP[alias as keyof typeof SYSTEM_CATEGORY_ALIAS_MAP] || alias
    }
    const tree = await categoryService.getCategoryTree(options)

    success(res, tree)
  } catch (err: unknown) {
    handleError(res, err, 'getCategoryTree')
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
    handleError(res, err, 'createCategory')
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
    handleError(res, err, 'updateCategory')
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
    handleError(res, err, 'deleteCategory')
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
