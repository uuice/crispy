import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { ruleService } from '../../services/ruleService'
import { success, error, notFound, handleZodError, handleError } from '../../utils/response'

// Get single rule
export const getRule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const rule = await ruleService.getRuleById(id)
    success(res, rule)
  } catch (err: unknown) {
    handleError(res, err, 'getRule')
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
      module_id:
        req.query['module_id'] !== undefined
          ? parseInt(req.query['module_id'] as string)
          : undefined,
      parent_id:
        req.query['parent_id'] !== undefined
          ? parseInt(req.query['parent_id'] as string)
          : undefined,
      sort: req.query['sort'] !== undefined ? parseInt(req.query['sort'] as string) : undefined,
      status:
        req.query['status'] !== undefined ? parseInt(req.query['status'] as string) : undefined,
      type_id:
        req.query['type_id'] !== undefined ? parseInt(req.query['type_id'] as string) : undefined,
      is_delete:
        req.query['is_delete'] !== undefined
          ? parseInt(req.query['is_delete'] as string)
          : undefined,
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
    const rule = await ruleService.createRule(req.body)
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

    const rule = await ruleService.updateRule(id, req.body)
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

    await ruleService.deleteRule(id)
    success(res, null, '规则删除成功')
  } catch (err: unknown) {
    handleError(res, err, 'deleteRule')
  }
}

import { Elysia } from 'elysia'
const ruleRouter = new Elysia({
  prefix: '/rules'
})
  .get('/', getRules)
  .get('/tree', getRuleTree)
  .get('/:id', getRule)
  .post('/', createRule)
  .put('/:id', updateRule)
  .delete('/:id', deleteRule)
export default ruleRouter
