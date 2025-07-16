import nunjucks from 'nunjucks'
import { voteItemService } from '@src/server/services/voteItemService'

// VoteItems 标签 - 获取投票项列表
export function VoteItems(): void {
  this.tags = ['VoteItems']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endVoteItems')
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
    if (args.vote_id !== undefined) filters.vote_id = args.vote_id
    if (args.status !== undefined) filters.status = args.status

    // Date filters - 时间戳，0 是有效值
    if (args.start_time !== undefined) filters.startTime = args.start_time
    if (args.end_time !== undefined) filters.endTime = args.end_time

    // Use the enhanced getVoteItems method with filters
    const result = await voteItemService.getVoteItems({ page, pageSize }, filters)

    context.ctx.vote_items = result.dataList
    context.ctx.vote_items_pagination = result.pagination

    const resultHtml = new nunjucks.runtime.SafeString(body())
    return callback(null, resultHtml)
  }
}

// VoteItemSingle 标签 - 获取单个投票项
export function VoteItemSingle(): void {
  this.tags = ['VoteItemSingle']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endVoteItemSingle')
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const id = args.id
    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    const voteItem = await voteItemService.getVoteItemById(id)
    context.ctx.voteItem = voteItem
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}

// VoteItemsByVote 标签 - 根据投票ID获取投票项列表
export function VoteItemsByVote(): void {
  this.tags = ['VoteItemsByVote']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endVoteItemsByVote')
    parser.advanceAfterBlockEnd()

    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const vote_id = args.vote_id
    const limit = args.limit || 10
    const page = args.page || 1
    const pageSize = args.page_size || limit

    if (!vote_id) {
      context.ctx.vote_items = []
      context.ctx.vote_items_pagination = { page: 1, pageSize, total: 0, totalPages: 0 }
      const resultHtml = new nunjucks.runtime.SafeString(body())
      return callback(null, resultHtml)
    }

    // Build filters object from args
    const filters: any = {}
    // 需要 !== undefined 因为可能包含 0 等 falsy 值
    if (vote_id !== undefined) filters.vote_id = vote_id

    // Use the enhanced getVoteItems method with filters
    const result = await voteItemService.getVoteItems({ page, pageSize }, filters)

    context.ctx.vote_items = result.dataList
    context.ctx.vote_items_pagination = result.pagination

    const resultHtml = new nunjucks.runtime.SafeString(body())
    return callback(null, resultHtml)
  }
}
