import { NextFunction, Request, Response } from 'express'
import { articleService } from '../services/articleService'
import { pageService } from '../services/pageService'
import { withSearchHighlight } from '../utils/searchHighlight'
import { error, success } from '../utils/response'

export const searchArticles = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    const { q } = req.query
    if (!q || typeof q !== 'string') {
      error(res, 'Query parameter "q" is required and must be a string', 400)
      return
    }

    const articles = await articleService.searchArticles(q)
    success(res, withSearchHighlight(articles, q, ['title', 'abstract']))
  } catch (err: unknown) {
    console.error('Error searching articles:', err)
    error(res, 'Internal server error')
  }
}

export const searchPages = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    const { q } = req.query
    if (!q || typeof q !== 'string') {
      error(res, 'Query parameter "q" is required and must be a string', 400)
      return
    }

    const pages = await pageService.searchPages(q)
    success(res, withSearchHighlight(pages, q, ['title', 'abstract']))
  } catch (err: unknown) {
    console.error('Error searching pages:', err)
    error(res, 'Internal server error')
  }
}

export const searchDaily = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    const { q } = req.query
    if (!q || typeof q !== 'string') {
      error(res, 'Query parameter "q" is required and must be a string', 400)
      return
    }

    const articles = await articleService.searchDailyArticles(q)
    success(res, withSearchHighlight(articles, q, ['title', 'abstract']))
  } catch (err: unknown) {
    console.error('Error searching daily articles:', err)
    error(res, 'Internal server error')
  }
}

export const searchController = {
  searchArticles,
  searchPages,
  searchDaily
}
