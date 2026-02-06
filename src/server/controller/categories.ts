import { NextFunction, Request, Response } from 'express'
import { error, handleError, success } from '../utils/response'
import { categoryService } from '../services/categoryService'
import { SYSTEM_CATEGORY_ALIAS_MAP } from '@src/server/config/const'
import { CategoryFilters } from '@src/types'

// Get single category
export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const category = await categoryService.getCategoryById(id)

    if (!category) {
      error(res, '分类不存在', 404)
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
    const result = await categoryService.getCategories(req.query as unknown as CategoryFilters)
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
      options.rootAlias =
        SYSTEM_CATEGORY_ALIAS_MAP[alias as keyof typeof SYSTEM_CATEGORY_ALIAS_MAP] || alias
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
    const result = await categoryService.create(req.body)

    success(res, result, '分类创建成功')
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
      error(res, '无效的ID', 400)
      return
    }

    const result = await categoryService.update(id, req.body)
    success(res, { id, ...req.body }, '分类更新成功')
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
      error(res, '无效的ID', 400)
      return
    }

    const deleted = await categoryService.delete(id)
    if (!deleted) {
      error(res, '分类不存在', 404)
      return
    }

    success(res, null, '分类删除成功')
  } catch (err: unknown) {
    handleError(res, err, 'deleteCategory')
  }
}

export const getCategoriesWithArticleCount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parentAlias = req.query['parentAlias'] as string | undefined

    const categories = await categoryService.getCategoriesWithArticleCount(parentAlias)

    success(res, categories)
  } catch (err: unknown) {
    console.error('Error fetching categories with article count:', err)
    error(res, 'Internal server error')
  }
}

export const getCategoryByAlias = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const alias = req.params['alias']
    const category = await categoryService.getCategoryByAlias(alias)
    success(res, category)
  } catch (err: unknown) {
    console.error('Error fetching category by alias:', err)
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
  deleteCategory,
  getCategoriesWithArticleCount,
  getCategoryByAlias
}
