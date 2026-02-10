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

    // Build filters object from args
    const filters: any = {}

    // Basic filters
    if (args.ad_id !== undefined) filters.ad_id = args.ad_id
    if (args.title) filters.title = args.title
    if (args.content) filters.content = args.content
    if (args.image_url) filters.image_url = args.image_url
    if (args.url) filters.url = args.url
    if (args.method) filters.method = args.method
    if (args.status !== undefined) filters.status = args.status

    // Use the enhanced getAdItems method with filters
    const result = await adItemService.getAdItems({ ...filters, page, pageSize })

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
      // Note: adItemService doesn't have getAdItemByTitle method, so we'll use getAdItems with title filter
      const filters: any = { title }
      if (ad_id !== undefined) filters.ad_id = ad_id
      const result = await adItemService.getAdItems({ page: 1, pageSize: 1, ...filters })
      adItem = result.dataList[0] || null
    }

    context.ctx.adItem = adItem
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}
