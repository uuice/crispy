import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import { configService } from '../../services/configService'

// Get single config
export const getConfig = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const config = await configService.getConfigById(id)

    if (!config) {
      notFound(res, 'Config not found')
      return
    }

    success(res, config)
  } catch (err: unknown) {
    console.error('Error fetching config:', err)
    error(res, 'Internal server error')
  }
}

// Get configs list with pagination
export const getConfigs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10

    // Get filters from query
    const filters = {
      title: req.query['title'] as string | undefined,
      alias: req.query['alias'] as string | undefined,
      type_id: req.query['type_id'] ? parseInt(req.query['type_id'] as string) : undefined,
      status: req.query['status'] ? parseInt(req.query['status'] as string) : undefined,
      start_time: req.query['start_time'] ? parseInt(req.query['start_time'] as string) : undefined,
      end_time: req.query['end_time'] ? parseInt(req.query['end_time'] as string) : undefined
    }

    const result = await configService.getConfigs(filters, { page, pageSize })

    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching configs:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const configController = {
  getConfig,
  getConfigs
}
