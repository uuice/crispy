import nunjucks from 'nunjucks'
import { join } from 'node:path'
import { Application } from 'express'
import { date } from '../nunjucks/filter/date'
import { truncate } from '../nunjucks/filter/truncate'
import { stripHtml } from '../nunjucks/filter/stripHtml'
import { titleToUrl } from '../nunjucks/filter/titleToUrl'
import { Console } from '../nunjucks/filter/console'
import { shorten } from '../nunjucks/filter/shorten'
import { symbolsCount } from '../nunjucks/filter/symbolsCount'
import { toFixed } from '../nunjucks/filter/toFixed'

import { dateFormat } from '../nunjucks/function/dateFormat'
import moment from 'moment'
import { getColor } from '../nunjucks/function/getColor'
import _ from 'lodash'
import { Config, ConfigItem } from '../nunjucks/tag/config'
import { ArticleItem, Articles } from '../nunjucks/tag/article'
import { LinkItem, Links } from '../nunjucks/tag/link'
import { NoticeItem, Notices } from '../nunjucks/tag/notice'
import { TagItem, Tags } from '../nunjucks/tag/tag'
import { Categories, CategoryItem } from '../nunjucks/tag/category'
import { MenuItem, Menus } from '../nunjucks/tag/menu'
import { EnumItem, Enums } from '../nunjucks/tag/enum'
import { AdItem, Ads } from '../nunjucks/tag/ad'
import { AdItems, AdItemSingle } from '../nunjucks/tag/adItem'
import { AttrItem, Attrs } from '../nunjucks/tag/attr'
import { AdditionItem, Additions } from '../nunjucks/tag/addition'
import { PageItem, Pages } from '../nunjucks/tag/page'
import { CommentItem, Comments } from '../nunjucks/tag/comment'
import { KeywordItem, Keywords } from '../nunjucks/tag/keyword'
import { JobItem, Jobs } from '../nunjucks/tag/job'
import { HolidayItem, Holidays } from '../nunjucks/tag/holiday'
import { UserItem, Users } from '../nunjucks/tag/user'
import { UserTypeItem, UserTypes } from '../nunjucks/tag/userType'
import { VoteItem, Votes } from '../nunjucks/tag/vote'
import { VoteItems, VoteItemSingle } from '../nunjucks/tag/voteItem'
import { RoleItem, Roles } from '../nunjucks/tag/role'
import { RuleItem, Rules } from '../nunjucks/tag/rule'

/**
 * Configure Nunjucks template engine
 */
export function configureNunjucks(app: Application) {
  // 开发环境：使用源码路径；生产环境：使用复制到 server 目录中的模板
  const isDevelopment = process.env['NODE_ENV'] === 'development'
  const templatesPath = isDevelopment
    ? join(process.cwd(), 'src/server/templates')
    : join(import.meta.dirname, 'templates')

  // Configure Nunjucks environment
  const env = nunjucks.configure(templatesPath, {
    autoescape: true,
    express: app,
    watch: process.env['NODE_ENV'] === 'development',
    noCache: process.env['NODE_ENV'] === 'development'
  })

  // Set view engine
  app.set('view engine', 'html')
  app.set('views', templatesPath)

  // Add global functions
  env.addGlobal('dateFormat', dateFormat)
  env.addGlobal('moment', moment)
  env.addGlobal('_', _)
  env.addGlobal('getColor', getColor)

  // Add custom filters
  env.addFilter('shorten', shorten)
  env.addFilter('console', Console)
  env.addFilter('date', date)
  env.addFilter('dateFormat', date)
  env.addFilter('symbolsCount', symbolsCount)
  env.addFilter('stripHtml', stripHtml)
  env.addFilter('titleToUrl', titleToUrl)
  env.addFilter('truncate', truncate)
  env.addFilter('toFixed', toFixed)

  // Add custom tags
  env.addExtension('Config', new Config())
  env.addExtension('ConfigItem', new ConfigItem())

  // Add model tags
  env.addExtension('Articles', new Articles())
  env.addExtension('ArticleItem', new ArticleItem())
  env.addExtension('Links', new Links())
  env.addExtension('LinkItem', new LinkItem())
  env.addExtension('Notices', new Notices())
  env.addExtension('NoticeItem', new NoticeItem())
  env.addExtension('Tags', new Tags())
  env.addExtension('TagItem', new TagItem())
  env.addExtension('Categories', new Categories())
  env.addExtension('CategoryItem', new CategoryItem())
  env.addExtension('Menus', new Menus())
  env.addExtension('MenuItem', new MenuItem())
  env.addExtension('Enums', new Enums())
  env.addExtension('EnumItem', new EnumItem())
  env.addExtension('Ads', new Ads())
  env.addExtension('AdItem', new AdItem())
  env.addExtension('AdItems', new AdItems())
  env.addExtension('AdItemSingle', new AdItemSingle())
  env.addExtension('Attrs', new Attrs())
  env.addExtension('AttrItem', new AttrItem())
  env.addExtension('Additions', new Additions())
  env.addExtension('AdditionItem', new AdditionItem())
  env.addExtension('Pages', new Pages())
  env.addExtension('PageItem', new PageItem())
  env.addExtension('Comments', new Comments())
  env.addExtension('CommentItem', new CommentItem())
  env.addExtension('Keywords', new Keywords())
  env.addExtension('KeywordItem', new KeywordItem())
  env.addExtension('Jobs', new Jobs())
  env.addExtension('JobItem', new JobItem())
  env.addExtension('Holidays', new Holidays())
  env.addExtension('HolidayItem', new HolidayItem())
  env.addExtension('Users', new Users())
  env.addExtension('UserItem', new UserItem())
  env.addExtension('UserTypes', new UserTypes())
  env.addExtension('UserTypeItem', new UserTypeItem())
  env.addExtension('Votes', new Votes())
  env.addExtension('VoteItem', new VoteItem())
  env.addExtension('VoteItems', new VoteItems())
  env.addExtension('VoteItemSingle', new VoteItemSingle())
  env.addExtension('Roles', new Roles())
  env.addExtension('RoleItem', new RoleItem())
  env.addExtension('Rules', new Rules())
  env.addExtension('RuleItem', new RuleItem())

  return env
}

/**
 * Render template with data
 */
export function renderTemplate(templateName: string, data: any = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    // 确保使用正确的模板路径（与 configureNunjucks 保持一致）
    const isDevelopment = process.env['NODE_ENV'] === 'development'
    const templatesPath = isDevelopment
      ? join(process.cwd(), 'src/server/templates')
      : join(import.meta.dirname, 'templates')

    const env = nunjucks.configure(templatesPath, {
      autoescape: true,
      watch: isDevelopment,
      noCache: isDevelopment
    })

    env.render(templateName, data, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result || '')
      }
    })
  })
}

/**
 * Render template string with data
 */
export function renderString(templateString: string, data: any = {}): string {
  return nunjucks.renderString(templateString, data)
}
