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
    const typeId = args.type_id
    const searchTerm = args.search

    let links
    if (typeId) {
      links = await linkService.getLinksByType(typeId)
    } else if (searchTerm) {
      links = await linkService.searchLinks(searchTerm)
    } else {
      const result = await linkService.getLinks({ page: 1, pageSize: args.limit || 10 })
      links = result.dataList
    }

    context.ctx.links = links
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
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
    return new nodes.CallExtensionAsync(this, 'run', args)
  }
  this.run = async function (context: any, args: any, callback: any) {
    const id = args.id
    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    const link = await linkService.getLinkById(id)
    const result = new nunjucks.runtime.SafeString(link ? JSON.stringify(link) : '')
    return callback(null, result)
  }
}
