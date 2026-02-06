import nunjucks from 'nunjucks'
import { adService } from '@src/server/services/adService'

// Ads 标签 - 获取广告列表
export function Ads(): void {
  this.tags = ['Ads']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endAds')
    parser.advanceAfterBlockEnd()

    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const active = args.active === 'true' || args.active === true
    const limit = args.limit || 10

    // 新增更多查询参数
    const filters: any = {}
    if (args.status !== undefined) filters.status = Number(args.status)
    if (args.sort_min !== undefined) filters.sort_min = Number(args.sort_min)
    if (args.sort_max !== undefined) filters.sort_max = Number(args.sort_max)
    if (args.start_time !== undefined) filters.start_time = Number(args.start_time)
    if (args.end_time !== undefined) filters.end_time = Number(args.end_time)
    if (args.has_image !== undefined)
      filters.has_image = args.has_image === 'true' || args.has_image === true
    if (args.has_url !== undefined)
      filters.has_url = args.has_url === 'true' || args.has_url === true
    if (args.content !== undefined) filters.content = args.content
    if (args.alias !== undefined) filters.alias = args.alias
    if (args.title !== undefined) filters.title = args.title
    if (args.type_id !== undefined) filters.type_id = Number(args.type_id)

    let ads
    if (active) {
      ads = await adService.getActiveAds()
    } else {
      const result = await adService.getAds({ ...filters, page: 1, pageSize: limit })
      ads = result.dataList
    }

    context.ctx.ads = ads
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}

// AdItem 标签 - 获取单个广告
export function AdItem(): void {
  this.tags = ['AdItem']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endAdItem')
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const id = args.id
    const withItems = args.with_items === 'true' || args.with_items === true

    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    let ad
    if (withItems) {
      ad = await adService.getAdWithItems(id)
    } else {
      ad = await adService.getById(id)
    }

    context.ctx.ad = ad
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}
