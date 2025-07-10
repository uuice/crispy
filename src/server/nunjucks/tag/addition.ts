import nunjucks from 'nunjucks'
import { additionService } from '@src/server/services/additionService'

// Additions 标签 - 获取附加项列表
export function Additions(): void {
  this.tags = ['Additions']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endAdditions')
    parser.advanceAfterBlockEnd()

    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const type = args.type // 1: required, 2: optional
    const limit = args.limit || 10

    let additions
    if (type === 1 || type === '1') {
      additions = await additionService.getRequiredAdditions()
    } else if (type === 2 || type === '2') {
      additions = await additionService.getOptionalAdditions()
    } else {
      const result = await additionService.getAdditions({ page: 1, pageSize: limit }, {})
      additions = result.dataList
    }

    context.ctx.additions = additions
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}

// AdditionItem 标签 - 获取单个附加项
export function AdditionItem(): void {
  this.tags = ['AdditionItem']
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

    const addition = await additionService.getAdditionById(id)
    const result = new nunjucks.runtime.SafeString(addition ? JSON.stringify(addition) : '')
    return callback(null, result)
  }
}
