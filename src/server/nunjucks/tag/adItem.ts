import nunjucks from 'nunjucks'
import { adItemService } from '@src/server/services/adItemService'

// AdItems 标签 - 获取广告项列表
export function AdItems(): void {
  this.tags = ['AdItems']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endAdItems')
    parser.advanceAfterBlockEnd()

    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const limit = args.limit || 10
    const page = args.page || 1
    const pageSize = args.page_size || limit

    const result = await adItemService.getAdItems({ ...args, page, pageSize })

    context.ctx.adItems = result.dataList
    context.ctx.adItems_pagination = result.pagination

    const resultHtml = new nunjucks.runtime.SafeString(body())
    return callback(null, resultHtml)
  }
}

// AdItemSingle 标签 - 获取单个广告项
export function AdItemSingle(): void {
  this.tags = ['AdItemSingle']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endAdItemSingle')
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const id = args.id
    const title = args.title
    const ad_id = args.ad_id

    if (!id && !title) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    let adItem
    if (id) {
      adItem = await adItemService.getById(id)
    } else if (title) {
      const result = await adItemService.getAdItems({ ...args, page: 1, pageSize: 1 })
      adItem = result.dataList[0] || null
    }

    context.ctx.adItem = adItem
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}
