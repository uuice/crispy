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
    const status = args.status || 10 // 默认获取已发布的页面
    const type_id = args.type_id
    const limit = args.limit || 10

    let pages
    if (type_id || status) {
      const result = await pageService.getPages({ page: 1, pageSize: limit }, { status, type_id })
      pages = result.dataList
    } else {
      const result = await pageService.getPages({ page: 1, pageSize: limit })
      pages = result.dataList
    }

    context.ctx.pages = pages
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
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
    return new nodes.CallExtensionAsync(this, 'run', args)
  }
  this.run = async function (_context: any, args: any, callback: any) {
    const id = args.id
    const alias = args.alias

    let page
    if (id) {
      page = await pageService.getPageById(id)
    } else if (alias) {
      page = await pageService.getPageByAlias(alias)
    }

    const result = new nunjucks.runtime.SafeString(page ? JSON.stringify(page) : '')
    return callback(null, result)
  }
}
