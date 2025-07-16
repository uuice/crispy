import nunjucks from 'nunjucks'
import { ruleService } from '@src/server/services/ruleService'

// Rules 标签 - 获取规则列表
export function Rules(): void {
  this.tags = ['Rules']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endRules')
    parser.advanceAfterBlockEnd()

    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const limit = args.limit || 10
    const page = args.page || 1
    const pageSize = args.page_size || limit

    // Build filters object from args
    const filters: any = {}

    // Search filters - 字符串，空字符串通常不是有效值
    if (args.title) filters.title = args.title
    if (args.alias) filters.alias = args.alias
    // 需要 !== undefined 因为可能包含 0 等 falsy 值
    if (args.module_id !== undefined) filters.module_id = args.module_id
    if (args.parent_id !== undefined) filters.parent_id = args.parent_id
    if (args.type_id !== undefined) filters.type_id = args.type_id
    if (args.status !== undefined) filters.status = args.status

    // Date filters - 时间戳，0 是有效值
    if (args.start_time !== undefined) filters.start_time = args.start_time
    if (args.end_time !== undefined) filters.end_time = args.end_time

    // Use the enhanced getRules method with filters
    const result = await ruleService.getRules({ page, pageSize }, filters)

    context.ctx.rules = result.dataList
    context.ctx.rules_pagination = result.pagination

    const resultHtml = new nunjucks.runtime.SafeString(body())
    return callback(null, resultHtml)
  }
}

// RuleItem 标签 - 获取单个规则
export function RuleItem(): void {
  this.tags = ['RuleItem']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endRuleItem')
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const id = args.id
    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    const rule = await ruleService.getRuleById(id)
    context.ctx.rule = rule
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}
