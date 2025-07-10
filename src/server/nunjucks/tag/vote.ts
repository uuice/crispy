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
    const status = args.status || 10 // 默认获取激活状态的投票
    const search = args.search
    const limit = args.limit || 10

    let votes
    if (search) {
      votes = await voteService.searchVotes(search)
      votes = votes.slice(0, limit)
    } else {
      const filters: any = {}
      if (status !== undefined) filters.status = status

      const result = await voteService.getVotes({ page: 1, pageSize: limit }, filters)
      votes = result.dataList
    }

    context.ctx.votes = votes
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}

// VoteItem 标签 - 获取单个投票（包含投票项）
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
  this.run = async function (context: any, args: any, callback: any) {
    const id = args.id
    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    const vote = await voteService.getVoteById(id)
    const result = new nunjucks.runtime.SafeString(vote ? JSON.stringify(vote) : '')
    return callback(null, result)
  }
}
