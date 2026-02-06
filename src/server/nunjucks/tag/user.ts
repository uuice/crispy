import nunjucks from 'nunjucks'
import { userService } from '@src/server/services/userService'

// Users 标签 - 获取用户列表
export function Users(): void {
  this.tags = ['Users']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endUsers')
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
    if (args.user_name) filters.user_name = args.user_name
    if (args.nick_name) filters.nick_name = args.nick_name
    if (args.real_name) filters.real_name = args.real_name
    if (args.email) filters.email = args.email
    if (args.phone) filters.phone = args.phone
    // 需要 !== undefined 因为可能包含 0 等 falsy 值
    if (args.status !== undefined) filters.status = args.status
    if (args.role_id !== undefined) filters.role_id = args.role_id
    if (args.type_id !== undefined) filters.type_id = args.type_id

    // Boolean filters - 需要 !== undefined 因为 false 是有效值
    if (args.is_admin !== undefined)
      filters.isAdmin = args.is_admin === 'true' || args.is_admin === true
    if (args.is_super_admin !== undefined)
      filters.isSuperAdmin = args.is_super_admin === 'true' || args.is_super_admin === true
    if (args.is_black !== undefined)
      filters.is_black = args.is_black === 'true' || args.is_black === true
    if (args.is_delete !== undefined)
      filters.isDelete = args.is_delete === 'true' || args.is_delete === true

    // Date filters - 时间戳，0 是有效值
    if (args.start_time !== undefined) filters.start_time = args.start_time
    if (args.end_time !== undefined) filters.end_time = args.end_time
    if (args.last_login_start !== undefined) filters.last_login_start = args.last_login_start
    if (args.last_login_end !== undefined) filters.last_login_end = args.last_login_end

    // Use the enhanced getUsers method with filters
    const result = await userService.getUsers({ ...filters, page, pageSize })

    context.ctx.users = result.dataList
    context.ctx.users_pagination = result.pagination

    const resultHtml = new nunjucks.runtime.SafeString(body())
    return callback(null, resultHtml)
  }
}

// UserItem 标签 - 获取单个用户
export function UserItem(): void {
  this.tags = ['UserItem']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endUserItem')
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const id = args.id
    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    const user = await userService.getById(id)
    context.ctx.user = user
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}
