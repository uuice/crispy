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
    const status = args.status || 10 // 默认获取激活状态的关键词
    const search = args.search
    const limit = args.limit || 10

    let keywords
    if (search) {
      keywords = await keywordService.searchKeywords(search)
      keywords = keywords.slice(0, limit)
    } else if (status) {
      keywords = await keywordService.getKeywordsByStatus(status)
      keywords = keywords.slice(0, limit)
    } else {
      const result = await keywordService.getKeywords({ page: 1, pageSize: limit })
      keywords = result.dataList
    }

    context.ctx.keywords = keywords
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
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
    return new nodes.CallExtensionAsync(this, 'run', args)
  }
  this.run = async function (context: any, args: any, callback: any) {
    const id = args.id
    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    const keyword = await keywordService.getKeywordById(id)
    const result = new nunjucks.runtime.SafeString(keyword ? JSON.stringify(keyword) : '')
    return callback(null, result)
  }
}
