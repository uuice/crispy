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
    const search = args.search
    const limit = args.limit || 10

    let holidays
    if (search) {
      holidays = await holidayService.searchHolidaysByName(search, limit)
    } else {
      holidays = await holidayService.getAllHolidays()
      holidays = holidays.slice(0, limit)
    }

    context.ctx.holidays = holidays
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
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
    return new nodes.CallExtensionAsync(this, 'run', args)
  }
  this.run = async function (context: any, args: any, callback: any) {
    const id = args.id
    const name = args.name
    const value = args.value

    let holiday
    if (id) {
      holiday = await holidayService.getHolidayById(id)
    } else if (name) {
      holiday = await holidayService.getHolidayByName(name)
    } else if (value) {
      holiday = await holidayService.getHolidayByValue(value)
    }

    const result = new nunjucks.runtime.SafeString(holiday ? JSON.stringify(holiday) : '')
    return callback(null, result)
  }
}
