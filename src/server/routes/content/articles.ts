import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import { articleService } from '../../services/articleService'

// Get single article
export const getArticle = async (
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

    const article = await articleService.getArticleById(id)

    if (!article) {
      notFound(res, 'Article not found')
      return
    }

    success(res, article)
  } catch (err: unknown) {
    console.error('Error fetching article:', err)
    error(res, 'Internal server error')
  }
}

// Get articles list with pagination
export const getArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10
    const filters = {
      title: req.query['title'] as string | undefined,
      sub_title: req.query['sub_title'] as string | undefined,
      abstract: req.query['abstract'] as string | undefined,
      content: req.query['content'] as string | undefined,
      author_id:
        req.query['author_id'] !== undefined
          ? parseInt(req.query['author_id'] as string)
          : undefined,
      user_id:
        req.query['user_id'] !== undefined ? parseInt(req.query['user_id'] as string) : undefined,
      type_id:
        req.query['type_id'] !== undefined ? parseInt(req.query['type_id'] as string) : undefined,
      type_ids: req.query['type_ids'] as string | undefined,
      status:
        req.query['status'] !== undefined ? parseInt(req.query['status'] as string) : undefined,
      is_review:
        req.query['is_review'] !== undefined
          ? parseInt(req.query['is_review'] as string)
          : undefined,
      tags: req.query['tags'] as string | undefined,
      attrs: req.query['attrs'] as string | undefined,
      url: req.query['url'] as string | undefined,
      redirect_url: req.query['redirect_url'] as string | undefined,
      image: req.query['image'] as string | undefined,
      image_list: req.query['image_list'] as string | undefined,
      seo_title: req.query['seo_title'] as string | undefined,
      seo_description: req.query['seo_description'] as string | undefined,
      seo_keywords: req.query['seo_keywords'] as string | undefined,
      remark: req.query['remark'] as string | undefined,
      click: req.query['click'] !== undefined ? parseInt(req.query['click'] as string) : undefined,
      sort: req.query['sort'] !== undefined ? parseInt(req.query['sort'] as string) : undefined,
      is_delete:
        req.query['is_delete'] !== undefined
          ? parseInt(req.query['is_delete'] as string)
          : undefined,
      update_time:
        req.query['update_time'] !== undefined
          ? parseInt(req.query['update_time'] as string)
          : undefined,
      create_time:
        req.query['create_time'] !== undefined
          ? parseInt(req.query['create_time'] as string)
          : undefined,
      start_time:
        req.query['start_time'] !== undefined
          ? parseInt(req.query['start_time'] as string)
          : undefined,
      end_time:
        req.query['end_time'] !== undefined ? parseInt(req.query['end_time'] as string) : undefined
    }
    const result = await articleService.getArticles(filters, { page, pageSize })
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching articles:', err)
    error(res, 'Internal server error')
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
  getArticles,
  getArticleByUrl
}
