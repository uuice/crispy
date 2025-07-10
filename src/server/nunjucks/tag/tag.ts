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
    const typeId = args.type_id
    const limit = args.limit || 10

    let tags
    if (typeId) {
      tags = await tagService.getTagsByTypeId(typeId)
    } else {
      const result = await tagService.getTags({ page: 1, pageSize: limit }, {})
      tags = result.dataList
    }

    context.ctx.tags = tags
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
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
    return new nodes.CallExtensionAsync(this, 'run', args)
  }
  this.run = async function (context: any, args: any, callback: any) {
    const id = args.id
    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    const tag = await tagService.getTagById(id)
    const result = new nunjucks.runtime.SafeString(tag ? JSON.stringify(tag) : '')
    return callback(null, result)
  }
}
