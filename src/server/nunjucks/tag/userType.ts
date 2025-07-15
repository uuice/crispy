import nunjucks from 'nunjucks'
import { userTypeService } from '@src/server/services/userTypeService'

// UserTypes 标签 - 获取用户类型列表
export function UserTypes(): void {
  this.tags = ['UserTypes']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endUserTypes')
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
    if (args.type_name) filters.type_name = args.type_name
    if (args.alias) filters.alias = args.alias
    // 需要 !== undefined 因为可能包含 0 等 falsy 值
    if (args.status !== undefined) filters.status = args.status

    // Date filters - 时间戳，0 是有效值
    if (args.start_time !== undefined) filters.start_time = args.start_time
    if (args.end_time !== undefined) filters.end_time = args.end_time

    // Use the enhanced getUserTypes method with filters
    const result = await userTypeService.getUserTypes({ page, pageSize }, filters)

    context.ctx.user_types = result.dataList
    context.ctx.user_types_pagination = result.pagination

    const resultHtml = new nunjucks.runtime.SafeString(body())
    return callback(null, resultHtml)
  }
}

// UserTypeItem 标签 - 获取单个用户类型
export function UserTypeItem(): void {
  this.tags = ['UserTypeItem']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    return new nodes.CallExtensionAsync(this, 'run', args)
  }
  this.run = async function (_context: any, args: any, callback: any) {
    const id = args.id
    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    const userType = await userTypeService.getUserTypeById(id)
    const result = new nunjucks.runtime.SafeString(userType ? JSON.stringify(userType) : '')
    return callback(null, result)
  }
}
