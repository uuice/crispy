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
    const tree = args.tree === 'true' || args.tree === true
    const status = args.status || 10 // 默认获取激活状态的规则
    const moduleId = args.module_id
    const parentId = args.parent_id
    const typeId = args.type_id
    const limit = args.limit || 10

    let rules
    if (tree) {
      rules = await ruleService.getRuleTree()
    } else if (moduleId) {
      rules = await ruleService.getRulesByModuleId(moduleId)
    } else if (parentId) {
      rules = await ruleService.getChildRules(parentId)
    } else {
      const filters: any = {}
      if (status) filters.status = status
      if (typeId) filters.type_id = typeId

      const result = await ruleService.getRules({ page: 1, pageSize: limit }, filters)
      rules = result.dataList
    }

    context.ctx.rules = rules
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
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
    return new nodes.CallExtensionAsync(this, 'run', args)
  }
  this.run = async function (context: any, args: any, callback: any) {
    const id = args.id
    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    const rule = await ruleService.getRuleById(id)
    const result = new nunjucks.runtime.SafeString(rule ? JSON.stringify(rule) : '')
    return callback(null, result)
  }
}
