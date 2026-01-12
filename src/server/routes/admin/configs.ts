import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import { configService } from '../../services/configService'

// Validation schemas
const createConfigSchema = z.object({
  title: z.string().min(1),
  alias: z.string().optional(),
  value: z.string().min(1),
  type_id: z.number().optional(),
  type_ids: z.string().optional(),
  sort: z.number().default(0),
  status: z.number().default(10)
})

const updateConfigSchema = createConfigSchema.partial()

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

    // Get filters from query
    const filters = {
      title: req.query['title'] as string | undefined,
      alias: req.query['alias'] as string | undefined,
      type_id:
        req.query['type_id'] !== undefined ? parseInt(req.query['type_id'] as string) : undefined,
      status:
        req.query['status'] !== undefined ? parseInt(req.query['status'] as string) : undefined,
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

// Create new config
export const createConfig = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createConfigSchema.parse(req.body)

    const result = await configService.createConfig(validatedData)

    success(res, result, 'Config created successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.issues)
      return
    }
    console.error('Error creating config:', err)
    error(res, 'Internal server error')
  }
}

// Upsert config by alias
export const upsertConfig = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createConfigSchema.parse(req.body)

    if (!validatedData.alias) {
      error(res, 'Alias is required for upsert operation', 400)
      return
    }

    const result = await configService.upsertConfigByAlias(validatedData)

    const message = result.isUpdated ? 'Config updated successfully' : 'Config created successfully'
    success(res, result, message)
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.issues)
      return
    }
    console.error('Error upserting config:', err)
    error(res, 'Internal server error')
  }
}

// Update config
export const updateConfig = async (
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

    const validatedData = updateConfigSchema.parse(req.body)

    const result = await configService.updateConfig(id, validatedData)

    if (!result.success) {
      notFound(res, 'Config not found')
      return
    }

    success(res, { id, ...validatedData }, 'Config updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.issues)
      return
    }
    console.error('Error updating config:', err)
    error(res, 'Internal server error')
  }
}

// Delete config (logical delete)
export const deleteConfig = async (
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

    const result = await configService.deleteConfig(id)

    if (!result.success) {
      notFound(res, 'Config not found')
      return
    }

    success(res, null, 'Config deleted successfully')
  } catch (err: unknown) {
    console.error('Error deleting config:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const configController = {
  getConfig,
  getConfigByAlias,
  getConfigs,
  createConfig,
  upsertConfig,
  updateConfig,
  deleteConfig
}

import { Elysia } from 'elysia'
const configRouter = new Elysia({
  prefix: '/configs'
})
  .get('/', getConfigs)
  .get('/:id', getConfig)
  .get('/alias/:alias', getConfigByAlias)
  .post('/', createConfig)
  .post('/upsert', upsertConfig)
  .put('/:id', updateConfig)
  .delete('/:id', deleteConfig)
export default configRouter
