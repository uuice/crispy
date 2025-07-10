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
    const adId = args.ad_id
    const limit = args.limit || 10

    let adItems
    if (adId) {
      adItems = await adItemService.getAdItemsByAdId(adId)
    } else {
      const result = await adItemService.getAdItems({ page: 1, pageSize: limit })
      adItems = result.dataList
    }

    context.ctx.adItems = adItems
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
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
    return new nodes.CallExtensionAsync(this, 'run', args)
  }
  this.run = async function (context: any, args: any, callback: any) {
    const id = args.id
    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    const adItem = await adItemService.getAdItemById(id)
    const result = new nunjucks.runtime.SafeString(adItem ? JSON.stringify(adItem) : '')
    return callback(null, result)
  }
}
