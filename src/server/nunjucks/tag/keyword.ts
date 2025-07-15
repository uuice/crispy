import nunjucks from 'nunjucks'
import { keywordService } from '@src/server/services/keywordService'

// Keywords 标签 - 获取关键词列表
export function Keywords(): void {
  this.tags = ['Keywords']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endKeywords')
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
    if (args.status !== undefined) filters.status = args.status

    // Date filters - 时间戳，0 是有效值
    if (args.start_time !== undefined) filters.startTime = args.start_time
    if (args.end_time !== undefined) filters.endTime = args.end_time

    // Use the enhanced getKeywords method with filters
    const result = await keywordService.getKeywords({ page, pageSize }, filters)

    context.ctx.keywords = result.dataList
    context.ctx.keywords_pagination = result.pagination

    const resultHtml = new nunjucks.runtime.SafeString(body())
    return callback(null, resultHtml)
  }
}

// KeywordItem 标签 - 获取单个关键词
export function KeywordItem(): void {
  this.tags = ['KeywordItem']
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

    const keyword = await keywordService.getKeywordById(id)
    const result = new nunjucks.runtime.SafeString(keyword ? JSON.stringify(keyword) : '')
    return callback(null, result)
  }
}
