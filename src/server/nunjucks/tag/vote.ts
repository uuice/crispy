import nunjucks from 'nunjucks'
import { voteService } from '@src/server/services/voteService'

// Votes 标签 - 获取投票列表
export function Votes(): void {
  this.tags = ['Votes']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endVotes')
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
    // 需要 !== undefined 因为可能包含 0 等 falsy 值
    if (args.is_multiple !== undefined) filters.is_multiple = args.is_multiple
    if (args.status !== undefined) filters.status = args.status

    // Date filters - 时间戳，0 是有效值
    if (args.start_time !== undefined) filters.startTime = args.start_time
    if (args.end_time !== undefined) filters.endTime = args.end_time

    // Use the enhanced getVotes method with filters
    const result = await voteService.getVotes({ page, pageSize }, filters)

    context.ctx.votes = result.dataList
    context.ctx.votes_pagination = result.pagination

    const resultHtml = new nunjucks.runtime.SafeString(body())
    return callback(null, resultHtml)
  }
}

// VoteItem 标签 - 获取单个投票
export function VoteItem(): void {
  this.tags = ['VoteItem']
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

    const vote = await voteService.getVoteById(id)
    const result = new nunjucks.runtime.SafeString(vote ? JSON.stringify(vote) : '')
    return callback(null, result)
  }
}
