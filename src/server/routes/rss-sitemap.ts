import { Router } from 'express'
import { articleService } from '../services/articleService'
import { categoryService } from '../services/categoryService'
import { tagService } from '../services/tagService'
import { pageService } from '../services/pageService'
import { catchAsync } from '../middleware/errorHandler'
import xml2js from 'xml2js'

import moment from 'moment'
import { env } from '../config/env'
import { join } from 'node:path'

const router = Router()

router.get(
  '/rss.xml',
  catchAsync(async (req, res) => {
    const { dataList: postList } = await articleService.getArticles(
      { status: 10 },
      { page: 1, pageSize: 100 }
    )
    const jsonRss = {
      rss: {
        $: {
          version: '2.0'
        },
        channel: {
          title: 'UUICE',
          link: req.get('host'),
          description: 'UUICE',
          item: (postList || []).map((post) => {
            return {
              title: '<![CDATA[' + post.title + ']]',
              link: env['BASE_URL'] + '/archives/' + post.url,
              description: '<![CDATA[' + (post.excerpt || post.title) + ']]',
              guid: '/archives/' + post.url,
              pubDate: moment(post.created_time as string).format('ddd, DD MMM YYYY HH:mm:ss [GMT]')
            }
          })
        }
      }
    }

    const builder = new xml2js.Builder()
    const xml = builder.buildObject(jsonRss)
    res.set('Content-Type', 'application/xml')
    res.set('Cache-Control', 'no-cache')
    return res.send(xml)
  })
)

router.get(
  '/sitemap.xml',
  catchAsync(async (req, res) => {
    const { dataList: postList } = await articleService.getArticles(
      { status: 10 },
      { page: 1, pageSize: 100 }
    )
    const { dataList: categoryList } = await categoryService.getCategories(
      { status: 10 },
      { page: 1, pageSize: 100 }
    )
    const { dataList: tagList } = await tagService.getTags(
      { page: 1, pageSize: 20 },
      { status: 10 }
    )
    const { dataList: pageList } = await pageService.getPages(
      { page: 1, pageSize: 100 },
      { status: 10 }
    )

    const jsonRss = {
      urlset: {
        $: {
          xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
          'xmlns:news': 'http://www.google.com/schemas/sitemap-news/0.9',
          'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
          'xsi:schemaLocation':
            'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd',
          'xmlns:mobile': 'http://www.google.com/schemas/sitemap-mobile/1.0',
          'xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
          'xmlns:video': 'http://www.google.com/schemas/sitemap-video/1.1'
        },
        url: [
          ...postList.map((post) => {
            return {
              loc: join(env['BASE_URL'], 'archives', post.url as string),
              lastmod: moment(post.updated_time as string).format(),
              changefreq: 'daily',
              priority: '0.7'
            }
          }),
          ...categoryList.map((cate) => {
            return {
              loc: join(env['BASE_URL'], 'categories', cate.alias || cate.title),
              lastmod: '',
              changefreq: 'daily',
              priority: '0.7'
            }
          }),

          ...tagList.map((tag) => {
            return {
              loc: join(env['BASE_URL'], 'tags', tag.title),
              lastmod: '',
              changefreq: 'daily',
              priority: '0.7'
            }
          }),

          ...pageList.map((page) => {
            return {
              loc: join(env['BASE_URL'], 'pages', (page.url || page.alias) as string),
              lastmod: moment(page.update_time as unknown as string).format(),
              changefreq: 'daily',
              priority: '0.7'
            }
          }),

          {
            loc: join(env['BASE_URL'], 'tags'),
            lastmod: '',
            changefreq: 'daily',
            priority: '0.5'
          },
          {
            loc: join(env['BASE_URL'], 'categories'),
            lastmod: '',
            changefreq: 'daily',
            priority: '0.5'
          },
          {
            loc: join(env['BASE_URL'], 'archives'),
            lastmod: '',
            changefreq: 'daily',
            priority: '0.5'
          }
        ]
      }
    }

    const builder = new xml2js.Builder()
    const xml = builder.buildObject(jsonRss)
    res.set('Content-Type', 'application/xml')
    res.set('Cache-Control', 'no-cache')
    return res.send(xml)
  })
)

export default router
