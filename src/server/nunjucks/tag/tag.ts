import nunjucks from 'nunjucks'
import { tagService } from '@src/server/services/tagService'

// Tags 标签 - 获取标签列表
export function Tags(): void {
  this.tags = ['Tags']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endTags')
    parser.advanceAfterBlockEnd()

    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const limit = args.limit || 10
    const page = args.page || 1
    const pageSize = args.page_size || limit

    const result = await tagService.getTags({ ...args, page, pageSize })

    context.ctx.tags = result.dataList
    context.ctx.tags_pagination = result.pagination

    const resultHtml = new nunjucks.runtime.SafeString(body())
    return callback(null, resultHtml)
  }
}

// TagItem 标签 - 获取单个标签
export function TagItem(): void {
  this.tags = ['TagItem']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endTagItem')
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const id = args.id
    // const alias = args.alias

    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    let tag
    if (id) {
      tag = await tagService.getById(id)
    }
    // else if (alias) {
    //   tag = await tagService.getTagByAlias(alias)
    // }

    context.ctx.tag = tag
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}
