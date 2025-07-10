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
    const voteId = args.vote_id
    const status = args.status || 10 // 默认获取激活状态的投票项
    const search = args.search
    const limit = args.limit || 10

    let voteItems
    if (search) {
      voteItems = await voteItemService.searchVoteItems(search)
      voteItems = voteItems.slice(0, limit)
    } else if (status) {
      voteItems = await voteItemService.getVoteItemsByStatus(status)
      voteItems = voteItems.slice(0, limit)
    } else {
      const filters: any = {}
      if (voteId) filters.vote_id = voteId

      const result = await voteItemService.getVoteItems({ page: 1, pageSize: limit }, filters)
      voteItems = result.dataList
    }

    context.ctx.voteItems = voteItems
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
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
    return new nodes.CallExtensionAsync(this, 'run', args)
  }
  this.run = async function (context: any, args: any, callback: any) {
    const id = args.id
    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    const voteItem = await voteItemService.getVoteItemById(id)
    const result = new nunjucks.runtime.SafeString(voteItem ? JSON.stringify(voteItem) : '')
    return callback(null, result)
  }
}
