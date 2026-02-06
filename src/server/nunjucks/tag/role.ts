import nunjucks from 'nunjucks'
import { roleService } from '@src/server/services/roleService'

// Roles 标签 - 获取角色列表
export function Roles(): void {
  this.tags = ['Roles']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endRoles')
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
    if (args.des) filters.des = args.des
    // 需要 !== undefined 因为可能包含 0 等 falsy 值
    if (args.module_id !== undefined) filters.module_id = args.module_id
    if (args.type_id !== undefined) filters.type_id = args.type_id
    if (args.status !== undefined) filters.status = args.status

    // Range filters - 需要 !== undefined 因为可能包含 0
    if (args.sort_min !== undefined) filters.sort_min = args.sort_min
    if (args.sort_max !== undefined) filters.sort_max = args.sort_max

    // Date filters - 时间戳，0 是有效值
    if (args.start_time !== undefined) filters.start_time = args.start_time
    if (args.end_time !== undefined) filters.end_time = args.end_time

    // Boolean filters - 需要 !== undefined 因为 false 是有效值
    if (args.has_rules !== undefined)
      filters.has_rules = args.has_rules === 'true' || args.has_rules === true

    // Use the enhanced getRoles method with filters
    const result = await roleService.getRoles({ ...filters, page, pageSize })

    context.ctx.roles = result.dataList
    context.ctx.roles_pagination = result.pagination

    const resultHtml = new nunjucks.runtime.SafeString(body())
    return callback(null, resultHtml)
  }
}

// RoleItem 标签 - 获取单个角色
export function RoleItem(): void {
  this.tags = ['RoleItem']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endRoleItem')
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const id = args.id
    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    const role = await roleService.getById(id)
    context.ctx.role = role
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}
