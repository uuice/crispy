import { NextFunction, Request, Response } from 'express'
import { error, handleError, success } from '../utils/response'
import { configService } from '../services/configService'
import { ConfigFilters } from '@src/types'

// Get single config by ID
export const getConfig = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const config = await configService.getById(id)

    if (!config) {
      error(res, '配置不存在', 404)
      return
    }

    success(res, config)
  } catch (err: unknown) {
    handleError(res, err, 'getConfig')
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
      error(res, 'Alias参数必填', 400)
      return
    }

    const config = await configService.getConfigByAlias(alias)

    if (!config) {
      error(res, '配置不存在', 404)
      return
    }

    success(res, config)
  } catch (err: unknown) {
    handleError(res, err, 'getConfigByAlias')
  }
}

// Get configs list with pagination
export const getConfigs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await configService.getConfigs(req.query as unknown as ConfigFilters)

    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getConfigs')
  }
}

// Create new config
export const createConfig = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await configService.create(req.body)

    success(res, result, '配置创建成功')
  } catch (err: unknown) {
    handleError(res, err, 'createConfig')
  }
}

// Upsert config by alias
export const upsertConfig = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.body.alias) {
      error(res, 'Alias参数必填', 400)
      return
    }

    const result = await configService.upsertConfigByAlias(req.body)

    const message = result.isUpdated ? '配置更新成功' : '配置创建成功'
    success(res, result, message)
  } catch (err: unknown) {
    handleError(res, err, 'upsertConfig')
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
      error(res, '无效的ID', 400)
      return
    }

    const result = await configService.update(id, req.body)
    success(res, result, '配置更新成功')
  } catch (err: unknown) {
    handleError(res, err, 'updateConfig')
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
      error(res, '无效的ID', 400)
      return
    }

    const deleted = await configService.delete(id)
    if (!deleted) {
      error(res, '配置不存在', 404)
      return
    }

    success(res, null, '配置删除成功')
  } catch (err: unknown) {
    handleError(res, err, 'deleteConfig')
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
