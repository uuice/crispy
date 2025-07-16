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
    const page = args.page || 1
    const pageSize = args.page_size || limit

    // Build filters object from args
    const filters: any = {}

    // Basic filters - 需要 !== undefined 因为可能包含 0 等 falsy 值
    if (args.type_id !== undefined) filters.type_id = args.type_id
    if (args.status !== undefined) filters.status = args.status
    if (args.author_id !== undefined) filters.author_id = args.author_id
    if (args.user_id !== undefined) filters.user_id = args.user_id
    if (args.is_review !== undefined) filters.is_review = args.is_review

    // Search filters - 字符串，空字符串通常不是有效值
    if (args.title) filters.title = args.title
    if (args.sub_title) filters.sub_title = args.sub_title
    if (args.abstract) filters.abstract = args.abstract
    if (args.url) filters.url = args.url
    if (args.tag) filters.tag = args.tag
    if (args.tags) filters.tags = args.tags
    if (args.type_ids) filters.type_ids = args.type_ids

    // Range filters - 需要 !== undefined 因为可能包含 0
    if (args.click_min !== undefined) filters.click_min = args.click_min
    if (args.click_max !== undefined) filters.click_max = args.click_max
    if (args.sort_min !== undefined) filters.sort_min = args.sort_min
    if (args.sort_max !== undefined) filters.sort_max = args.sort_max

    // Date filters - 时间戳，0 是有效值
    if (args.start_time !== undefined) filters.start_time = args.start_time
    if (args.end_time !== undefined) filters.end_time = args.end_time
    if (args.publish_start !== undefined) filters.publish_start = args.publish_start
    if (args.publish_end !== undefined) filters.publish_end = args.publish_end

    // Boolean filters - 需要 !== undefined 因为 false 是有效值
    if (args.has_image !== undefined)
      filters.has_image = args.has_image === 'true' || args.has_image === true
    if (args.has_redirect_url !== undefined)
      filters.has_redirect_url = args.has_redirect_url === 'true' || args.has_redirect_url === true

    // Use the enhanced getArticles method with filters
    const result = await articleService.getArticles(filters, { page, pageSize })

    context.ctx.articles = result.dataList
    context.ctx.articles_pagination = result.pagination

    const resultHtml = new nunjucks.runtime.SafeString(body())
    return callback(null, resultHtml)
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
    const body = parser.parseUntilBlocks('endArticleItem')
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const id = args.id
    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    const article = await articleService.getArticleById(id)
    context.ctx.article = article
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}
