import nunjucks from 'nunjucks'
import { linkService } from '@src/server/services/linkService'

// Links 标签 - 获取链接列表
export function Links(): void {
  this.tags = ['Links']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endLinks')
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
    if (args.site_name) filters.site_name = args.site_name
    if (args.url) filters.url = args.url
    if (args.des) filters.des = args.des
    if (args.logo) filters.logo = args.logo
    if (args.method) filters.method = args.method
    // 需要 !== undefined 因为可能包含 0 等 falsy 值
    if (args.status !== undefined) filters.status = args.status
    if (args.type_id !== undefined) filters.type_id = args.type_id

    // Range filters - 需要 !== undefined 因为可能包含 0
    if (args.sort_min !== undefined) filters.sort_min = args.sort_min
    if (args.sort_max !== undefined) filters.sort_max = args.sort_max

    // Date filters - 时间戳，0 是有效值
    if (args.start_time !== undefined) filters.startTime = args.start_time
    if (args.end_time !== undefined) filters.endTime = args.end_time

    // Use the enhanced getLinks method with filters
    const result = await linkService.getLinks({ page, pageSize }, filters)

    context.ctx.links = result.dataList
    context.ctx.links_pagination = result.pagination

    const resultHtml = new nunjucks.runtime.SafeString(body())
    return callback(null, resultHtml)
  }
}

// LinkItem 标签 - 获取单个链接
export function LinkItem(): void {
  this.tags = ['LinkItem']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endLinkItem')
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const id = args.id
    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    const link = await linkService.getLinkById(id)
    context.ctx.link = link
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}
