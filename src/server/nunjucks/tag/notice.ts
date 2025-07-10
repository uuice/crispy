import nunjucks from 'nunjucks'
import { noticeService } from '@src/server/services/noticeService'

// Notices 标签 - 获取通知列表
export function Notices(): void {
  this.tags = ['Notices']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endNotices')
    parser.advanceAfterBlockEnd()

    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const status = args.status || 10 // 默认获取激活状态的通知
    const limit = args.limit || 10

    let notices
    if (status) {
      notices = await noticeService.getNoticesByStatus(status)
      notices = notices.slice(0, limit)
    } else {
      const result = await noticeService.getNotices({ page: 1, pageSize: limit })
      notices = result.dataList
    }

    context.ctx.notices = notices
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}

// NoticeItem 标签 - 获取单个通知
export function NoticeItem(): void {
  this.tags = ['NoticeItem']
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

    const notice = await noticeService.getNoticeById(id)
    const result = new nunjucks.runtime.SafeString(notice ? JSON.stringify(notice) : '')
    return callback(null, result)
  }
}
