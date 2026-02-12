import nunjucks from 'nunjucks'
import { holidayService } from '@src/server/services/holidayService'

// Holidays 标签 - 获取节假日列表
export function Holidays(): void {
  this.tags = ['Holidays']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endHolidays')
    parser.advanceAfterBlockEnd()

    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const limit = args.limit || 10
    const page = args.page || 1
    const pageSize = args.page_size || limit

    const result = await holidayService.getHolidays({ ...args, page, pageSize })

    context.ctx.holidays = result.dataList
    context.ctx.holidays_pagination = result.pagination

    const resultHtml = new nunjucks.runtime.SafeString(body())
    return callback(null, resultHtml)
  }
}

// HolidayItem 标签 - 获取单个节假日
export function HolidayItem(): void {
  this.tags = ['HolidayItem']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endHolidayItem')
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const id = args.id
    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    const holiday = await holidayService.getById(id)
    context.ctx.holiday = holiday
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}
