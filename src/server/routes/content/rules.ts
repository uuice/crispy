import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { ruleService } from '../../services/ruleService'
import { success, error, validationError, notFound } from '../../utils/response'

// Get single rule
export const getRule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const rule = await ruleService.getRuleById(id)
    success(res, rule)
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Rule not found') {
      notFound(res, 'Rule not found')
      return
    }
    console.error('Error fetching rule:', err)
    error(res, 'Internal server error')
  }
}

// Get rules list with pagination
export const getRules = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10

    const filters = {
      title: req.query['title'] as string | undefined,
      alias: req.query['alias'] as string | undefined,
      condition: req.query['condition'] as string | undefined,
      des: req.query['des'] as string | undefined,
      icon: req.query['icon'] as string | undefined,
      module_id: req.query['module_id'] ? parseInt(req.query['module_id'] as string) : undefined,
      parent_id: req.query['parent_id'] ? parseInt(req.query['parent_id'] as string) : undefined,
      sort: req.query['sort'] ? parseInt(req.query['sort'] as string) : undefined,
      status: req.query['status'] ? parseInt(req.query['status'] as string) : undefined,
      type_id: req.query['type_id'] ? parseInt(req.query['type_id'] as string) : undefined,
      is_delete: req.query['is_delete'] ? parseInt(req.query['is_delete'] as string) : undefined,
      update_time: req.query['update_time']
        ? parseInt(req.query['update_time'] as string)
        : undefined,
      create_time: req.query['create_time']
        ? parseInt(req.query['create_time'] as string)
        : undefined
    }
    const result = await ruleService.getRules({ page, pageSize }, filters)
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching rules:', err)
    error(res, 'Internal server error')
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
    console.error('Error fetching rule tree:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const ruleController = {
  getRule,
  getRules,
  getRuleTree
}
