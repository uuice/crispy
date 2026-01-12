import { NextFunction, Request, Response } from 'express'
import { error, notFound, success } from '../../utils/response'
import { pageService } from '../../services/pageService'

// Get single page
export const getPage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const page = await pageService.getPageById(id)

    if (!page) {
      notFound(res, 'Page not found')
      return
    }

    success(res, page)
  } catch (err: unknown) {
    console.error('Error fetching page:', err)
    error(res, 'Internal server error')
  }
}

// Get pages list with pagination
export const getPages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10

    const filters = {
      title: req.query['title'] as string | undefined,
      alias: req.query['alias'] as string | undefined,
      status:
        req.query['status'] !== undefined ? parseInt(req.query['status'] as string) : undefined,
      type_id:
        req.query['type_id'] !== undefined ? parseInt(req.query['type_id'] as string) : undefined,
      author_id:
        req.query['author_id'] !== undefined
          ? parseInt(req.query['author_id'] as string)
          : undefined,
      user_id:
        req.query['user_id'] !== undefined ? parseInt(req.query['user_id'] as string) : undefined,
      url: req.query['url'] as string | undefined,
      remark: req.query['remark'] as string | undefined,
      tags: req.query['tags'] as string | undefined,
      seo_title: req.query['seo_title'] as string | undefined,
      seo_description: req.query['seo_description'] as string | undefined,
      seo_keywords: req.query['seo_keywords'] as string | undefined,
      sub_title: req.query['sub_title'] as string | undefined,
      abstract: req.query['abstract'] as string | undefined,
      image_list: req.query['image_list'] as string | undefined,
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
    const result = await pageService.getPages({ page, pageSize }, filters)
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching pages:', err)
    error(res, 'Internal server error')
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
  getPageByUrl
}
