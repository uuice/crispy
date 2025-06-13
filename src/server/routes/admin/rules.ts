import { db } from '@src/libs/db'
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'

// Validation schemas
const createRuleSchema = z.object({
  title: z.string().min(1),
  alias: z.string().min(1),
  condition: z.string().optional(),
  des: z.string().optional(),
  icon: z.string().optional(),
  module_id: z.number().default(0),
  parent_id: z.number().default(0),
  sort: z.number().default(0),
  status: z.number().default(10),
  type_id: z.number().default(0)
})

const updateRuleSchema = createRuleSchema.partial()

// Get single rule
export const getRule = async (
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

    const rule = await db
      .selectFrom('rules')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!rule) {
      notFound(res, 'Rule not found')
      return
    }

    success(res, rule)
  } catch (err: unknown) {
    console.error('Error fetching rule:', err)
    error(res, 'Internal server error')
  }
}

// Get rules list with pagination
export const getRules = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10
    const offset = (page - 1) * pageSize

    // Get filters from query
    const title = req.query['title'] as string | undefined
    const alias = req.query['alias'] as string | undefined
    const moduleId = req.query['module_id'] ? parseInt(req.query['module_id'] as string) : undefined
    const parentId = req.query['parent_id'] ? parseInt(req.query['parent_id'] as string) : undefined
    const typeId = req.query['type_id'] ? parseInt(req.query['type_id'] as string) : undefined
    const status = req.query['status'] ? parseInt(req.query['status'] as string) : undefined

    let query = db.selectFrom('rules').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (title) {
      query = query.where('title', 'like', `%${title}%`)
    }
    if (alias) {
      query = query.where('alias', 'like', `%${alias}%`)
    }
    if (moduleId !== undefined && !isNaN(moduleId)) {
      query = query.where('module_id', '=', moduleId)
    }
    if (parentId !== undefined && !isNaN(parentId)) {
      query = query.where('parent_id', '=', parentId)
    }
    if (typeId !== undefined && !isNaN(typeId)) {
      query = query.where('type_id', '=', typeId)
    }
    if (status !== undefined && !isNaN(status)) {
      query = query.where('status', '=', status)
    }

    // Order by sort asc, create_time desc by default
    query = query.orderBy('sort', 'asc').orderBy('create_time', 'desc')

    const [rules, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    success(res, {
      data: rules,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    })
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
    const rules = await db
      .selectFrom('rules')
      .selectAll()
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()

    // Build rule tree
    const ruleMap = new Map<number, any>()
    const ruleTree: any[] = []

    // First pass: create a map of all rules
    rules.forEach((rule) => {
      ruleMap.set(rule.id, { ...rule, children: [] })
    })

    // Second pass: build the tree structure
    rules.forEach((rule) => {
      const ruleWithChildren = ruleMap.get(rule.id)
      if (!ruleWithChildren) return

      if (rule.parent_id === 0) {
        ruleTree.push(ruleWithChildren)
      } else {
        const parent = ruleMap.get(rule.parent_id)
        if (parent) {
          if (!parent.children) {
            parent.children = []
          }
          parent.children.push(ruleWithChildren)
        }
      }
    })

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
    const validatedData = createRuleSchema.parse(req.body)

    // If parent_id is provided, verify that the parent rule exists
    if (validatedData.parent_id !== 0) {
      const parentRule = await db
        .selectFrom('rules')
        .select('id')
        .where('id', '=', validatedData.parent_id)
        .where('is_delete', '=', 0)
        .executeTakeFirst()

      if (!parentRule) {
        error(res, 'Parent rule not found', 400)
        return
      }
    }

    const now = Date.now()
    const newRule = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.insertInto('rules').values(newRule).executeTakeFirst()

    success(
      res,
      {
        id: Number(result.insertId),
        ...newRule
      },
      'Rule created successfully'
    )
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
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

    const validatedData = updateRuleSchema.parse(req.body)

    // If parent_id is being updated, verify that the new parent rule exists
    if (validatedData.parent_id !== undefined && validatedData.parent_id !== 0) {
      const parentRule = await db
        .selectFrom('rules')
        .select('id')
        .where('id', '=', validatedData.parent_id)
        .where('is_delete', '=', 0)
        .executeTakeFirst()

      if (!parentRule) {
        error(res, 'Parent rule not found', 400)
        return
      }

      // Prevent circular reference
      if (validatedData.parent_id === id) {
        error(res, 'Rule cannot be its own parent', 400)
        return
      }
    }

    const updateData = {
      ...validatedData,
      update_time: Date.now()
    }

    const result = await db
      .updateTable('rules')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Rule not found')
      return
    }

    success(res, { id, ...updateData }, 'Rule updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
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

    // Check if rule has children
    const hasChildren = await db
      .selectFrom('rules')
      .select('id')
      .where('parent_id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (hasChildren) {
      error(res, 'Cannot delete rule with children', 400)
      return
    }

    const result = await db
      .updateTable('rules')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Rule not found')
      return
    }

    success(res, null, 'Rule deleted successfully')
  } catch (err: unknown) {
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
