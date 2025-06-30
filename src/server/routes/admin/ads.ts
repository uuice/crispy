import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { adService } from '../../services/adService'
import { success, error, validationError, notFound } from '../../utils/response'

// Validation schemas
const createAdSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
  image_url: z.string().optional(),
  link_url: z.string().optional(),
  position: z.string().optional(),
  start_time: z.number().optional(),
  end_time: z.number().optional(),
  status: z.number().default(10),
  sort: z.number().default(0)
})

const updateAdSchema = createAdSchema.partial()

// Get single ad
export const getAd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const ad = await adService.getAdById(id)
    success(res, ad)
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Ad not found') {
      notFound(res, 'Ad not found')
      return
    }
    console.error('Error fetching ad:', err)
    error(res, 'Internal server error')
  }
}

// Get ads list with pagination
export const getAds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10

    const result = await adService.getAds({ page, pageSize })
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching ads:', err)
    error(res, 'Internal server error')
  }
}

// Create new ad
export const createAd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ad = await adService.createAd(req.body)
    success(res, ad, 'Ad created successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error creating ad:', err)
    error(res, 'Internal server error')
  }
}

// Update ad
export const updateAd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const ad = await adService.updateAd(id, req.body)
    success(res, ad, 'Ad updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    if (err instanceof Error && err.message === 'Ad not found') {
      notFound(res, 'Ad not found')
      return
    }
    console.error('Error updating ad:', err)
    error(res, 'Internal server error')
  }
}

// Delete ad (logical delete)
export const deleteAd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    await adService.deleteAd(id)
    success(res, null, 'Ad deleted successfully')
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Ad not found') {
      notFound(res, 'Ad not found')
      return
    }
    console.error('Error deleting ad:', err)
    error(res, 'Internal server error')
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
