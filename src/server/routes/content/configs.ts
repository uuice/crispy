import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import { configService } from '../../services/configService'

// Get single config by ID
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

// Get single config by alias
export const getConfigByAlias = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const alias = req.params['alias']
    if (!alias) {
      error(res, 'Alias is required', 400)
      return
    }

    const config = await configService.getConfigByAlias(alias)

    if (!config) {
      notFound(res, 'Config not found')
      return
    }

    success(res, config)
  } catch (err: unknown) {
    console.error('Error fetching config by alias:', err)
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

    const filters = {
      title: req.query['title'] as string | undefined,
      alias: req.query['alias'] as string | undefined,
      type_id:
        req.query['type_id'] !== undefined ? parseInt(req.query['type_id'] as string) : undefined,
      type_ids: req.query['type_ids'] as string | undefined,
      status:
        req.query['status'] !== undefined ? parseInt(req.query['status'] as string) : undefined,
      value: req.query['value'] as string | undefined,
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
  getConfigByAlias,
  getConfigs
}
