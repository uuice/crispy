import nunjucks from 'nunjucks'
import { pageService } from '@src/server/services/pageService'

// Pages 标签 - 获取页面列表
export function Pages(): void {
  this.tags = ['Pages']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endPages')
    parser.advanceAfterBlockEnd()

    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const limit = args.limit || 10
    const page = args.page || 1
    const pageSize = args.page_size || limit

    const result = await pageService.getPages({ ...args, page, pageSize })

    context.ctx.pages = result.dataList
    context.ctx.pages_pagination = result.pagination

    const resultHtml = new nunjucks.runtime.SafeString(body())
    return callback(null, resultHtml)
  }
}

// PageItem 标签 - 获取单个页面
export function PageItem(): void {
  this.tags = ['PageItem']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endPageItem')
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const id = args.id
    const alias = args.alias

    if (!id && !alias) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    let page
    if (id) {
      page = await pageService.getById(id)
    } else if (alias) {
      page = await pageService.getPageByAlias(alias)
    }

    context.ctx.page = page
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}
