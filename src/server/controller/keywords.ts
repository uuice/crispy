import { NextFunction, Request, Response } from 'express'
import { error, handleError, success } from '../utils/response'
import { keywordService } from '../services/keywordService'
import { KeywordFilters } from '@src/types'

// Get single keyword
export const getKeyword = async (
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

    const keyword = await keywordService.getById(id)

    if (!keyword) {
      error(res, '关键词不存在', 404)
      return
    }

    success(res, keyword)
  } catch (err: unknown) {
    handleError(res, err, 'getKeyword')
  }
}

// Get keywords list with pagination
export const getKeywords = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await keywordService.getKeywords(req.query as unknown as KeywordFilters)
    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getKeywords')
  }
}

// Create new keyword
export const createKeyword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newKeyword = await keywordService.create(req.body)
    success(res, newKeyword, '关键词创建成功')
  } catch (err: unknown) {
    handleError(res, err, 'createKeyword')
  }
}

// Update keyword
export const updateKeyword = async (
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

    const updated = await keywordService.update(id, req.body)

    if (!updated) {
      error(res, '关键词不存在', 404)
      return
    }

    success(res, { id, ...req.body }, '关键词更新成功')
  } catch (err: unknown) {
    handleError(res, err, 'updateKeyword')
  }
}

// Delete keyword (logical delete)
export const deleteKeyword = async (
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

    const deleted = await keywordService.delete(id)

    if (!deleted) {
      error(res, '关键词不存在', 404)
      return
    }

    success(res, null, '关键词删除成功')
  } catch (err: unknown) {
    handleError(res, err, 'deleteKeyword')
  }
}

// Export all functions as a controller object
export const keywordController = {
  getKeyword,
  getKeywords,
  createKeyword,
  updateKeyword,
  deleteKeyword
}
