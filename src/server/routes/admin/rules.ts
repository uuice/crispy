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

    // Get filters from query
    const filters = {
      title: req.query['title'] as string | undefined,
      alias: req.query['alias'] as string | undefined,
      module_id: req.query['module_id'] ? parseInt(req.query['module_id'] as string) : undefined,
      parent_id: req.query['parent_id'] ? parseInt(req.query['parent_id'] as string) : undefined,
      type_id: req.query['type_id'] ? parseInt(req.query['type_id'] as string) : undefined,
      status: req.query['status'] ? parseInt(req.query['status'] as string) : undefined
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

// Create new rule
export const createRule = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rule = await ruleService.createRule(req.body)
    success(res, rule, 'Rule created successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    if (err instanceof Error) {
      const message = err.message
      if (message === 'Parent rule not found') {
        error(res, 'Parent rule not found', 400)
        return
      }
    }
    console.error('Error creating rule:', err)
    error(res, 'Internal server error')
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
      error(res, 'Invalid ID', 400)
      return
    }

    const rule = await ruleService.updateRule(id, req.body)
    success(res, rule, 'Rule updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    if (err instanceof Error) {
      const message = err.message
      if (message === 'Rule not found') {
        notFound(res, 'Rule not found')
        return
      }
      if (message === 'Parent rule not found') {
        error(res, 'Parent rule not found', 400)
        return
      }
      if (message === 'Rule cannot be its own parent') {
        error(res, 'Rule cannot be its own parent', 400)
        return
      }
    }
    console.error('Error updating rule:', err)
    error(res, 'Internal server error')
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
      error(res, 'Invalid ID', 400)
      return
    }

    await ruleService.deleteRule(id)
    success(res, null, 'Rule deleted successfully')
  } catch (err: unknown) {
    if (err instanceof Error) {
      const message = err.message
      if (message === 'Rule not found') {
        notFound(res, 'Rule not found')
        return
      }
      if (message === 'Cannot delete rule with children') {
        error(res, 'Cannot delete rule with children', 400)
        return
      }
    }
    console.error('Error deleting rule:', err)
    error(res, 'Internal server error')
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
