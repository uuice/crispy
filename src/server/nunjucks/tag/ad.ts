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
    const page = args.page || 1
    const pageSize = args.page_size || limit
    let ads
    if (active) {
      ads = await adService.getActiveAds()
    } else {
      const result = await adService.getAds({ ...args, page, pageSize })
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
