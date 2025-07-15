import nunjucks from 'nunjucks'
import { enumService } from '@src/server/services/enumService'

// Enums 标签 - 获取枚举列表
export function Enums(): void {
  this.tags = ['Enums']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endEnums')
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
    if (args.code) filters.code = args.code
    // 需要 !== undefined 因为可能包含 0 等 falsy 值
    if (args.status !== undefined) filters.status = args.status

    // Date filters - 时间戳，0 是有效值
    if (args.start_time !== undefined) filters.start_time = args.start_time
    if (args.end_time !== undefined) filters.end_time = args.end_time

    // Use the enhanced getEnums method with filters
    const result = await enumService.getEnums(filters, { page, pageSize })

    context.ctx.enums = result.dataList
    context.ctx.enums_pagination = result.pagination

    const resultHtml = new nunjucks.runtime.SafeString(body())
    return callback(null, resultHtml)
  }
}

// EnumItem 标签 - 获取单个枚举
export function EnumItem(): void {
  this.tags = ['EnumItem']
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

    const enumItem = await enumService.getEnumById(id)
    const result = new nunjucks.runtime.SafeString(enumItem ? JSON.stringify(enumItem) : '')
    return callback(null, result)
  }
}
