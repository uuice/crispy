import { db } from '@src/libs/db'
import { DELETE_STATUS } from '../config/const'
import {
  CreateRule,
  createRuleSchema,
  CreateSuccess,
  PaginatedResult,
  RuleEntity,
  RuleFilters,
  RuleTreeItem,
  UpdateRule,
  updateRuleSchema,
  UpdateSuccess
} from '@src/types'

// Rule Service Class
export class RuleService {
  /**
   * Get a single rule by ID
   */
  async getById(id: number): Promise<RuleEntity | null> {
    const rule = await db
      .selectFrom('rules')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    return rule || null
  }

  /**
   * Get rules list with pagination and filters
   */
  async getRules(filters: RuleFilters): Promise<PaginatedResult<RuleEntity>> {
    const page = Number(filters.page) || 1
    const pageSize = Number(filters.pageSize) || 10
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('rules').selectAll()

    // Add filters if provided
    if (filters.title) {
      query = query.where('title', 'like', `%${filters.title}%`)
    }
    if (filters.alias) {
      query = query.where('alias', 'like', `%${filters.alias}%`)
    }
    if (filters.module_id !== undefined) {
      query = query.where('module_id', '=', filters.module_id)
    }
    if (filters.parent_id !== undefined) {
      query = query.where('parent_id', '=', filters.parent_id)
    }
    if (filters.type_id !== undefined) {
      query = query.where('type_id', '=', filters.type_id)
    }
    if (filters.status !== undefined) {
      query = query.where('status', '=', filters.status)
    }

    query = query.where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    const [rules, total] = await Promise.all([
      query
        .orderBy('sort', 'asc')
        .orderBy('create_time', 'desc')
        .limit(pageSize)
        .offset(offset)
        .execute(),
      db
        .selectFrom('rules')
        .select((eb) => [eb.fn.count('id').as('count')])
        .$call((qb) => {
          if (filters.title) {
            qb = qb.where('title', 'like', `%${filters.title}%`)
          }
          if (filters.alias) {
            qb = qb.where('alias', 'like', `%${filters.alias}%`)
          }
          if (filters.module_id !== undefined) {
            qb = qb.where('module_id', '=', filters.module_id)
          }
          if (filters.parent_id !== undefined) {
            qb = qb.where('parent_id', '=', filters.parent_id)
          }
          if (filters.type_id !== undefined) {
            qb = qb.where('type_id', '=', filters.type_id)
          }
          if (filters.status !== undefined) {
            qb = qb.where('status', '=', filters.status)
          }
          qb = qb.where('is_delete', '=', DELETE_STATUS.UN_DELETE)
          return qb
        })
        .executeTakeFirst()
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
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
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
  async create(createData: CreateRule): Promise<CreateSuccess> {
    const validatedData = createRuleSchema.parse(createData)

    // If parent_id is provided, verify that the parent rule exists
    if (validatedData.parent_id && validatedData.parent_id !== 0) {
      const parentRule = await db
        .selectFrom('rules')
        .select('id')
        .where('id', '=', validatedData.parent_id)
        .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
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
      is_delete: DELETE_STATUS.UN_DELETE
    }

    const result = await db.insertInto('rules').values(newRule).executeTakeFirst()
    if (!result) throw new Error('创建规则失败')
    return { id: Number(result.insertId) }
  }

  /**
   * Update an existing rule
   */
  async update(id: number, updateData: UpdateRule): Promise<UpdateSuccess> {
    const validatedData = updateRuleSchema.parse(updateData)

    // If parent_id is being updated, verify that the new parent rule exists
    if (validatedData.parent_id !== undefined && validatedData.parent_id !== 0) {
      const parentRule = await db
        .selectFrom('rules')
        .select('id')
        .where('id', '=', validatedData.parent_id)
        .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
        .executeTakeFirst()

      if (!parentRule) {
        throw new Error('Parent rule not found')
      }

      // Prevent circular reference
      if (validatedData.parent_id === id) {
        throw new Error('Rule cannot be its own parent')
      }
    }

    const result = await db
      .updateTable('rules')
      .set({ ...validatedData, update_time: Date.now() })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!result) throw new Error('更新规则失败')
    return { id }
  }

  /**
   * Delete a rule (logical delete)
   */
  async delete(id: number): Promise<boolean> {
    // Check if rule has children
    const hasChildren = await db
      .selectFrom('rules')
      .select('id')
      .where('parent_id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (hasChildren) {
      throw new Error('Cannot delete rule with children')
    }

    const result = await db
      .updateTable('rules')
      .set({
        is_delete: DELETE_STATUS.DELETE,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    return Number(result.numUpdatedRows) > 0
  }

  /**
   * Check if rule exists by title
   */
  async ruleExistsByTitle(title: string): Promise<boolean> {
    const rule = await db
      .selectFrom('rules')
      .select(['id'])
      .where('title', '=', title)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
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
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    return !!rule
  }

  /**
   * Get rules by module_id
   */
  async getRulesByModuleId(moduleId: number): Promise<RuleEntity[]> {
    return await db
      .selectFrom('rules')
      .selectAll()
      .where('module_id', '=', moduleId)
      .where('status', '=', 10)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Get child rules by parent_id
   */
  async getChildRules(parentId: number): Promise<RuleEntity[]> {
    return await db
      .selectFrom('rules')
      .selectAll()
      .where('parent_id', '=', parentId)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()
  }
}

// Export service instance
export const ruleService = new RuleService()
