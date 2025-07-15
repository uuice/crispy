import nunjucks from 'nunjucks'
import { additionService } from '@src/server/services/additionService'

// Additions 标签 - 获取附加信息列表
export function Additions(): void {
  this.tags = ['Additions']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endAdditions')
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
    if (args.value) filters.value = args.value
    // 需要 !== undefined 因为可能包含 0 等 falsy 值
    if (args.type !== undefined) filters.type = args.type
    if (args.status !== undefined) filters.status = args.status

    // Date filters - 时间戳，0 是有效值
    if (args.start_time !== undefined) filters.start_time = args.start_time
    if (args.end_time !== undefined) filters.end_time = args.end_time

    // Use the enhanced getAdditions method with filters
    const result = await additionService.getAdditions({ page, pageSize }, filters)

    context.ctx.additions = result.dataList
    context.ctx.additions_pagination = result.pagination

    const resultHtml = new nunjucks.runtime.SafeString(body())
    return callback(null, resultHtml)
  }
}

// AdditionItem 标签 - 获取单个附加信息
export function AdditionItem(): void {
  this.tags = ['AdditionItem']
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

    const addition = await additionService.getAdditionById(id)
    const result = new nunjucks.runtime.SafeString(addition ? JSON.stringify(addition) : '')
    return callback(null, result)
  }
}
