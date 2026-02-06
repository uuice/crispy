import { NextFunction, Request, Response } from 'express'
import { flexsearchService } from '../services/flexsearch-index.service'
import { error, success } from '../utils/response'

// 文章全文检索
export const searchArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { q } = req.query
    if (!q || typeof q !== 'string') {
      error(res, 'Query parameter "q" is required and must be a string', 400)
      return
    }

    const result = await flexsearchService.searchArticles(q)
    success(res, result)
  } catch (err: unknown) {
    console.error('Error searching articles:', err)
    error(res, 'Internal server error')
  }
}

// 页面全文检索
export const searchPages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { q } = req.query
    if (!q || typeof q !== 'string') {
      error(res, 'Query parameter "q" is required and must be a string', 400)
      return
    }

    const result = await flexsearchService.searchPages(q)
    success(res, result)
  } catch (err: unknown) {
    console.error('Error searching pages:', err)
    error(res, 'Internal server error')
  }
}

// 每日类库文章检索
export const searchDaily = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { q } = req.query
    if (!q || typeof q !== 'string') {
      error(res, 'Query parameter "q" is required and must be a string', 400)
      return
    }

    const result = await flexsearchService.searchDaily(q)
    success(res, result)
  } catch (err: unknown) {
    console.error('Error searching daily articles:', err)
    error(res, 'Internal server error')
  }
}

// 导出控制器
export const searchController = {
  searchArticles,
  searchPages,
  searchDaily
}
