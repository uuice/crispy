import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import { categoryService } from '../../services/categoryService'

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

    const filters = {
      title: req.query['title'] as string | undefined,
      alias: req.query['alias'] as string | undefined,
      des: req.query['des'] as string | undefined,
      parent_id: req.query['parent_id'] ? parseInt(req.query['parent_id'] as string) : undefined,
      sort: req.query['sort'] ? parseInt(req.query['sort'] as string) : undefined,
      status: req.query['status'] ? parseInt(req.query['status'] as string) : undefined,
      is_delete: req.query['is_delete'] ? parseInt(req.query['is_delete'] as string) : undefined,
      update_time: req.query['update_time']
        ? parseInt(req.query['update_time'] as string)
        : undefined,
      create_time: req.query['create_time']
        ? parseInt(req.query['create_time'] as string)
        : undefined
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

// Export all functions as a controller object
export const categoryController = {
  getCategory,
  getCategories,
  getCategoryTree
}
