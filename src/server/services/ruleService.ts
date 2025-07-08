import { db } from '@src/server/libs/db'
import { z } from 'zod'

// Validation schemas
const createRuleSchema = z.object({
  title: z.string().min(1, '规则名称不能为空'),
  alias: z.string().min(1, '规则别名不能为空'),
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

// Types
export interface CreateRuleData {
  title: string
  alias: string
  condition?: string
  des?: string
  icon?: string
  module_id?: number
  parent_id?: number
  sort?: number
  status?: number
  type_id?: number
}

export type UpdateRuleData = Partial<CreateRuleData>

export interface PaginationOptions {
  page: number
  pageSize: number
}

export interface PaginatedResult<T> {
  dataList: T[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export interface FilterOptions {
  title?: string
  alias?: string
  module_id?: number
  parent_id?: number
  type_id?: number
  status?: number
}

export interface RuleTreeItem {
  id: number
  title: string
  alias: string
  condition?: string
  des?: string
  icon?: string
  module_id: number
  parent_id: number
  sort: number
  status: number
  type_id: number
  create_time: number
  update_time: number
  children?: RuleTreeItem[]
}

// Rule Service Class
export class RuleService {
  /**
   * Get a single rule by ID
   */
  async getRuleById(id: number): Promise<any> {
    const rule = await db
      .selectFrom('rules')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!rule) {
      throw new Error('Rule not found')
    }

    return rule
  }

  /**
   * Get rules list with pagination and filters
   */
  async getRules(
    options: PaginationOptions,
    filters?: FilterOptions
  ): Promise<PaginatedResult<any>> {
    const { page, pageSize } = options
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('rules').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (filters?.title) {
      query = query.where('title', 'like', `%${filters.title}%`)
    }
    if (filters?.alias) {
      query = query.where('alias', 'like', `%${filters.alias}%`)
    }
    if (filters?.module_id !== undefined) {
      query = query.where('module_id', '=', filters.module_id)
    }
    if (filters?.parent_id !== undefined) {
      query = query.where('parent_id', '=', filters.parent_id)
    }
    if (filters?.type_id !== undefined) {
      query = query.where('type_id', '=', filters.type_id)
    }
    if (filters?.status !== undefined) {
      query = query.where('status', '=', filters.status)
    }

    // Order by sort asc, create_time desc by default
    query = query.orderBy('sort', 'asc').orderBy('create_time', 'desc')

    const [rules, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    return {
      dataList: rules,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Get rules tree structure
   */
  async getRuleTree(): Promise<RuleTreeItem[]> {
    const rules = await db
      .selectFrom('rules')
      .selectAll()
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()

    // Build rule tree
    const ruleMap = new Map<number, RuleTreeItem>()
    const ruleTree: RuleTreeItem[] = []

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

    return ruleTree
  }

  /**
   * Create a new rule
   */
  async createRule(ruleData: CreateRuleData): Promise<any> {
    // Validate input data
    const validatedData = createRuleSchema.parse(ruleData)

    // If parent_id is provided, verify that the parent rule exists
    if (validatedData.parent_id !== 0) {
      const parentRule = await db
        .selectFrom('rules')
        .select('id')
        .where('id', '=', validatedData.parent_id)
        .where('is_delete', '=', 0)
        .executeTakeFirst()

      if (!parentRule) {
        throw new Error('Parent rule not found')
      }
    }

    const now = Date.now()
    const newRule = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.safeInsertInto('rules').values(newRule).executeTakeFirst()

    return {
      id: Number(result.insertId),
      ...newRule
    }
  }

  /**
   * Update an existing rule
   */
  async updateRule(id: number, ruleData: UpdateRuleData): Promise<any> {
    // Validate input data
    const validatedData = updateRuleSchema.parse(ruleData)

    // If parent_id is being updated, verify that the new parent rule exists
    if (validatedData.parent_id !== undefined && validatedData.parent_id !== 0) {
      const parentRule = await db
        .selectFrom('rules')
        .select('id')
        .where('id', '=', validatedData.parent_id)
        .where('is_delete', '=', 0)
        .executeTakeFirst()

      if (!parentRule) {
        throw new Error('Parent rule not found')
      }

      // Prevent circular reference
      if (validatedData.parent_id === id) {
        throw new Error('Rule cannot be its own parent')
      }
    }

    const updateData = {
      ...validatedData,
      update_time: Date.now()
    }

    const result = await db
      .safeUpdateTable('rules')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      throw new Error('Rule not found')
    }

    return { id, ...updateData }
  }

  /**
   * Delete a rule (logical delete)
   */
  async deleteRule(id: number): Promise<void> {
    // Check if rule has children
    const hasChildren = await db
      .selectFrom('rules')
      .select('id')
      .where('parent_id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (hasChildren) {
      throw new Error('Cannot delete rule with children')
    }

    const result = await db
      .safeUpdateTable('rules')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      throw new Error('Rule not found')
    }
  }

  /**
   * Check if rule exists by title
   */
  async ruleExistsByTitle(title: string): Promise<boolean> {
    const rule = await db
      .selectFrom('rules')
      .select(['id'])
      .where('title', '=', title)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return !!rule
  }

  /**
   * Check if rule exists by alias
   */
  async ruleExistsByAlias(alias: string): Promise<boolean> {
    const rule = await db
      .selectFrom('rules')
      .select(['id'])
      .where('alias', '=', alias)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return !!rule
  }

  /**
   * Get rules by module_id
   */
  async getRulesByModuleId(moduleId: number): Promise<any[]> {
    return await db
      .selectFrom('rules')
      .selectAll()
      .where('module_id', '=', moduleId)
      .where('is_delete', '=', 0)
      .where('status', '=', 10)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Get child rules by parent_id
   */
  async getChildRules(parentId: number): Promise<any[]> {
    return await db
      .selectFrom('rules')
      .selectAll()
      .where('parent_id', '=', parentId)
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()
  }
}

// Export service instance
export const ruleService = new RuleService()

// Export schemas for validation
export { createRuleSchema, updateRuleSchema }
