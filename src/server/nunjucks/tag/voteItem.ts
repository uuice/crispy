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

    const result = await voteItemService.getVoteItems({ ...args, page, pageSize })

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

    const voteItem = await voteItemService.getById(id)
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

    // Use the enhanced getVoteItems method with filters
    const result = await voteItemService.getVoteItems({ ...args, page, pageSize })

    context.ctx.vote_items = result.dataList
    context.ctx.vote_items_pagination = result.pagination

    const resultHtml = new nunjucks.runtime.SafeString(body())
    return callback(null, resultHtml)
  }
}
