import { Charset, Document, DocumentData } from 'flexsearch'
import fs from 'fs'
import path from 'path'
import { escapeRegExp } from 'lodash'
import { ArticleWithCategory, PageEntity } from '@src/types'

const INDEX_DIR = path.resolve(process.cwd(), 'temp/flexsearch')
const ARTICLE_INDEX_FILE = path.join(INDEX_DIR, 'article-index.json')
const PAGE_INDEX_FILE = path.join(INDEX_DIR, 'page-index.json')
const DAILY_INDEX_FILE = path.join(INDEX_DIR, 'daily-index.json')

function createArticleIndex() {
  return new Document({
    document: {
      id: 'id',
      index: ['title', 'abstract'],
      store: true
    },
    // Enable CJK (Chinese, Japanese, Korean) support
    tokenize: 'full',
    encoder: Charset.CJK
  })
}
function createPageIndex() {
  return new Document({
    document: {
      id: 'id',
      index: ['title', 'abstract'],
      store: true
    },
    // Enable CJK (Chinese, Japanese, Korean) support
    tokenize: 'full',
    encoder: Charset.CJK
  })
}
function createDailyIndex() {
  return new Document({
    document: {
      id: 'id',
      index: ['title', 'abstract'],
      store: true
    },
    // Enable CJK (Chinese, Japanese, Korean) support
    tokenize: 'full',
    encoder: Charset.CJK
  })
}

let articleIndex = createArticleIndex()
let pageIndex = createPageIndex()
let dailyIndex = createDailyIndex()

function restoreIndex(index: Document<DocumentData, false, false>, file: string) {
  if (fs.existsSync(file)) {
    const data = fs.readFileSync(file, 'utf-8')
    index.import('default', data)
    console.log(`[FlexSearch] Restored index from ${file}`)
  }
}

async function persistIndex(index: Document<DocumentData, false, false>, file: string) {
  await new Promise<void>((resolve, reject) => {
    index.export((key: string, data: string) => {
      try {
        fs.writeFileSync(file, data, 'utf-8')
        console.log(`[FlexSearch] Persisted index to ${file}`)
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  })
}

function ensureIndexDir() {
  if (!fs.existsSync(INDEX_DIR)) fs.mkdirSync(INDEX_DIR, { recursive: true })
}
ensureIndexDir()
restoreIndex(articleIndex, ARTICLE_INDEX_FILE)
restoreIndex(pageIndex, PAGE_INDEX_FILE)
restoreIndex(dailyIndex, DAILY_INDEX_FILE)

/**
 * Highlight matched keyword in text with <mark> tag
 */
function highlightText(text: string, keyword: string): string {
  if (!text || !keyword) return text
  const pattern = keyword.split(/\s+/).filter(Boolean).map(escapeRegExp).join('|')
  return text.replace(new RegExp(pattern, 'gi'), (match) => `<mark>${match}</mark>`)
}

/**
 * Merge and deduplicate flexsearch results, and highlight matched fields
 * @param raw flexsearch raw result
 * @param keyword search keyword
 */
export function mergeAndHighlightFlexsearchResults(raw: any[], keyword: string): any[] {
  const map = new Map<string, any>()
  for (const fieldResult of raw) {
    const field = fieldResult.field
    for (const item of fieldResult.result) {
      if (!map.has(item.id)) {
        map.set(item.id, { ...item.doc, _highlight: {} })
      }
      if (item.doc && item.doc[field]) {
        map.get(item.id)._highlight[field] = highlightText(item.doc[field], keyword)
      }
    }
  }
  return Array.from(map.values())
}

export const flexsearchService = {
  async buildIndexes(articles: ArticleWithCategory[], pages: PageEntity[]) {
    articleIndex = createArticleIndex()
    pageIndex = createPageIndex()
    dailyIndex = createDailyIndex()
    for (const article of articles) {
      articleIndex.add(article as any)
      if (article.category_alias === 'daily-libs') dailyIndex.add(article as any)
    }
    for (const page of pages) {
      pageIndex.add(page as any)
    }
  },
  async addArticle(article: ArticleWithCategory) {
    await articleIndex.add(article as any)
    if (article.category_alias === 'daily-libs') await dailyIndex.add(article as any)
  },
  async updateArticle(article: ArticleWithCategory) {
    await articleIndex.update(article as any)
    if (article.category_alias === 'daily-libs') await dailyIndex.update(article as any)
    else await dailyIndex.remove(article.id)
  },
  async removeArticle(id: string) {
    await articleIndex.remove(id)
    await dailyIndex.remove(id)
  },
  async addPage(page: PageEntity) {
    await pageIndex.add(page as any)
  },
  async updatePage(page: PageEntity) {
    await pageIndex.update(page as any)
  },
  async removePage(id: string) {
    await pageIndex.remove(id)
  },
  async searchArticles(query: string) {
    const raw = await articleIndex.searchAsync({ query, enrich: true })
    return mergeAndHighlightFlexsearchResults(raw, query)
  },
  async searchPages(query: string) {
    const raw = await pageIndex.searchAsync({ query, enrich: true })
    return mergeAndHighlightFlexsearchResults(raw, query)
  },
  async searchDaily(query: string) {
    const raw = await dailyIndex.searchAsync({ query, enrich: true })
    return mergeAndHighlightFlexsearchResults(raw, query)
  },
  async persistAll() {
    await persistIndex(articleIndex, ARTICLE_INDEX_FILE)
    await persistIndex(pageIndex, PAGE_INDEX_FILE)
    await persistIndex(dailyIndex, DAILY_INDEX_FILE)
  },
  async getArticleById(id: string) {
    // Get a single article by id
    return articleIndex.get(id)
  },
  async getDailyById(id: string) {
    // Get a single daily by id
    return dailyIndex.get(id)
  },
  async getPageById(id: string) {
    // Get a single page by id
    return pageIndex.get(id)
  }
}
