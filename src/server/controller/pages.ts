import { NextFunction, Request, Response } from 'express'
import { error, handleError, success } from '../utils/response'
import { pageService } from '../services/pageService'
import { PageFilters } from '@src/types'

// Get single page
export const getPage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const page = await pageService.getById(id)

    if (!page) {
      error(res, '页面不存在', 404)
      return
    }

    success(res, page)
  } catch (err: unknown) {
    handleError(res, err, 'getPage')
  }
}

// Get pages list with pagination
export const getPages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await pageService.getPages(req.query as unknown as PageFilters)
    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getPages')
  }
}

// Create new page
export const createPage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newPage = await pageService.create(req.body)
    success(res, newPage, '页面创建成功')
  } catch (err: unknown) {
    if (err instanceof Error) {
      error(res, err.message, 400)
      return
    }
    handleError(res, err, 'createPage')
  }
}

// Update page
export const updatePage = async (
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

    const updated = await pageService.update(id, req.body)
    success(res, updated, '页面更新成功')
  } catch (err: unknown) {
    if (err instanceof Error) {
      error(res, err.message, 400)
      return
    }
    handleError(res, err, 'updatePage')
  }
}

// Delete page (logical delete)
export const deletePage = async (
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

    const deleted = await pageService.delete(id)

    if (!deleted) {
      error(res, '页面不存在', 404)
      return
    }

    success(res, null, '页面删除成功')
  } catch (err: unknown) {
    handleError(res, err, 'deletePage')
  }
}

export const getPageByUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const url = req.params['url']
    const page = await pageService.getPageByUrl(url)
    success(res, page)
  } catch (err: unknown) {
    console.error('Error fetching page by url:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const pageController = {
  getPage,
  getPages,
  createPage,
  updatePage,
  deletePage,
  getPageByUrl
}
