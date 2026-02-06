import { NextFunction, Request, Response } from 'express'
import { adService } from '../services/adService'
import { error, handleError, success } from '../utils/response'
import { AdFilters } from '@src/types'

// Get single ad
export const getAd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const ad = await adService.getById(id)
    if (!ad) {
      error(res, '广告不存在', 404)
      return
    }
    success(res, ad)
  } catch (err: unknown) {
    handleError(res, err, 'getAd')
  }
}

// Get ads list with pagination
export const getAds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await adService.getAds(req.query as unknown as AdFilters)
    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getAds')
  }
}

// Create new ad
export const createAd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ad = await adService.create(req.body)
    success(res, ad, '广告创建成功')
  } catch (err: unknown) {
    handleError(res, err, 'createAd')
  }
}

// Update ad
export const updateAd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const ad = await adService.update(id, req.body)
    success(res, ad, '广告更新成功')
  } catch (err: unknown) {
    handleError(res, err, 'updateAd')
  }
}

// Delete ad (logical delete)
export const deleteAd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const deleted = await adService.delete(id)
    if (!deleted) {
      error(res, '广告不存在', 404)
      return
    }
    success(res, null, '广告删除成功')
  } catch (err: unknown) {
    handleError(res, err, 'deleteAd')
  }
}

// Export all functions as a controller object
export const adController = {
  getAd,
  getAds,
  createAd,
  updateAd,
  deleteAd
}
