import nunjucks from 'nunjucks'
import { articleService } from '@src/server/services/articleService'

// Articles 标签 - 获取文章列表
export function Articles(): void {
  this.tags = ['Articles']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endArticles')
    parser.advanceAfterBlockEnd()

    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const limit = args.limit || 10
    const typeId = args.type_id
    const status = args.status || 10 // 默认获取已发布的文章

    let articles
    if (typeId) {
      articles = await articleService.getArticlesByCategory(typeId, limit)
    } else if (status) {
      articles = await articleService.getArticlesByStatus(status, limit)
    } else {
      articles = await articleService.getRecentArticles(limit)
    }

    context.ctx.articles = articles
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}

// ArticleItem 标签 - 获取单个文章
export function ArticleItem(): void {
  this.tags = ['ArticleItem']
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
    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    const article = await articleService.getArticleById(id)
    const result = new nunjucks.runtime.SafeString(article ? JSON.stringify(article) : '')
    return callback(null, result)
  }
}
