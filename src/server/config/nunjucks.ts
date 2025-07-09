import nunjucks from 'nunjucks'
import { join } from 'node:path'
import { Application } from 'express'

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
  app.set('view engine', 'njk')
  app.set('views', templatesPath)

  // Add custom filters
  env.addFilter('dateFormat', function (date: Date | string, format: string = 'YYYY-MM-DD') {
    if (!date) return ''
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''

    switch (format) {
      case 'YYYY-MM-DD':
        return d.toISOString().split('T')[0]
      case 'YYYY-MM-DD HH:mm':
        return d.toISOString().replace('T', ' ').substring(0, 16)
      case 'MM-DD':
        return d.toISOString().substring(5, 10)
      default:
        return d.toLocaleDateString()
    }
  })

  env.addFilter('truncate', function (str: string, length: number = 100) {
    if (!str) return ''
    if (str.length <= length) return str
    return str.substring(0, length) + '...'
  })

  env.addFilter('stripHtml', function (str: string) {
    if (!str) return ''
    return str.replace(/<[^>]*>/g, '')
  })

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
