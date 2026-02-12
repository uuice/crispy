import nunjucks from 'nunjucks'
import { keywordService } from '@src/server/services/keywordService'

// Keywords 标签 - 获取关键词列表
export function Keywords(): void {
  this.tags = ['Keywords']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endKeywords')
    parser.advanceAfterBlockEnd()

    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const limit = args.limit || 10
    const page = args.page || 1
    const pageSize = args.page_size || limit

    const result = await keywordService.getKeywords({ ...args, page, pageSize })

    context.ctx.keywords = result.dataList
    context.ctx.keywords_pagination = result.pagination

    const resultHtml = new nunjucks.runtime.SafeString(body())
    return callback(null, resultHtml)
  }
}

// KeywordItem 标签 - 获取单个关键词
export function KeywordItem(): void {
  this.tags = ['KeywordItem']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endKeywordItem')
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const id = args.id
    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    const keyword = await keywordService.getById(id)
    context.ctx.keyword = keyword
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}
