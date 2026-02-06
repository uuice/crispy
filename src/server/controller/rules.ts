import { NextFunction, Request, Response } from 'express'
import { ruleService } from '../services/ruleService'
import { error, handleError, success } from '../utils/response'
import { RuleFilters } from '@src/types'

// Get single rule
export const getRule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const rule = await ruleService.getById(id)

    if (!rule) {
      error(res, '规则不存在', 404)
      return
    }

    success(res, rule)
  } catch (err: unknown) {
    handleError(res, err, 'getRule')
  }
}

// Get rules list with pagination
export const getRules = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await ruleService.getRules(req.query as unknown as RuleFilters)
    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getRules')
  }
}

// Get rules tree
export const getRuleTree = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ruleTree = await ruleService.getRuleTree()
    success(res, ruleTree)
  } catch (err: unknown) {
    handleError(res, err, 'getRuleTree')
  }
}

// Create new rule
export const createRule = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rule = await ruleService.create(req.body)
    success(res, rule, '规则创建成功')
  } catch (err: unknown) {
    handleError(res, err, 'createRule')
  }
}

// Update rule
export const updateRule = async (
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

    const rule = await ruleService.update(id, req.body)
    success(res, rule, '规则更新成功')
  } catch (err: unknown) {
    handleError(res, err, 'updateRule')
  }
}

// Delete rule (logical delete)
export const deleteRule = async (
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

    const deleted = await ruleService.delete(id)

    if (!deleted) {
      error(res, '规则不存在', 404)
      return
    }

    success(res, null, '规则删除成功')
  } catch (err: unknown) {
    handleError(res, err, 'deleteRule')
  }
}

// Export all functions as a controller object
export const ruleController = {
  getRule,
  getRules,
  getRuleTree,
  createRule,
  updateRule,
  deleteRule
}
