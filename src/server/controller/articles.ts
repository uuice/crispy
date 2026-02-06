import { NextFunction, Request, Response } from 'express'
import { error, handleError, success } from '../utils/response'
import { articleService } from '../services/articleService'
import { ArticleFilters } from '@src/types'

// Get single article
export const getArticle = async (
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

    const article = await articleService.getById(id)

    if (!article) {
      error(res, '文章不存在', 404)
      return
    }

    success(res, article)
  } catch (err: unknown) {
    handleError(res, err, 'getArticle')
  }
}

// Get articles list with pagination
export const getArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await articleService.getArticles(req.query as unknown as ArticleFilters)
    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getArticles')
  }
}

// Create new article
export const createArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await articleService.create(req.body)
    success(res, result, '文章创建成功')
  } catch (err: unknown) {
    handleError(res, err, 'createArticle')
  }
}

// Update article
export const updateArticle = async (
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

    const result = await articleService.update(id, req.body)
    success(res, result, '文章更新成功')
  } catch (err: unknown) {
    handleError(res, err, 'updateArticle')
  }
}

// Delete article (logical delete)
export const deleteArticle = async (
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

    const deleted = await articleService.delete(id)
    if (!deleted) {
      error(res, '文章不存在', 404)
      return
    }

    success(res, null, '文章删除成功')
  } catch (err: unknown) {
    handleError(res, err, 'deleteArticle')
  }
}

export const getArticleByUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const url = req.params['url']
    const article = await articleService.getArticleByUrl(url)
    success(res, article)
  } catch (err: unknown) {
    console.error('Error fetching article by url:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const articleController = {
  getArticle,
  getArticleByUrl,
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle
}
