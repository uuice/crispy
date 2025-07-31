import { writeFileSync, mkdirSync, existsSync, rmSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { articleService } from './articleService'
import { pageService } from './pageService'
import { categoryService } from './categoryService'
import { tagService } from './tagService'
import { env } from '../config/env'
import { staticGenerationConfig } from '../config/static-generation'

export interface StaticGenerationResult {
  success: boolean
  message: string
  generatedFiles: string[]
  errors: string[]
  totalPages: number
  totalArticles: number
  totalCategories: number
  totalTags: number
  mainPages: number
  performance: {
    totalTime: number
    averageTimePerPage: number
    concurrentRequests: number
  }
}

export class StaticGenerationService {
  private staticDir = join(process.cwd(), 'temp', 'static')
  private baseUrl = env['STATIC_GENERATION_BASE_URL'] || env['BASE_URL'] || 'http://localhost:4000'
  private maxConcurrent = staticGenerationConfig.maxConcurrent
  private requestTimeout = staticGenerationConfig.requestTimeout

  constructor() {
    this.ensureStaticDir()
  }

  /**
   * Generate all static pages with performance optimization
   */
  async generateAllStaticPages(): Promise<StaticGenerationResult> {
    const startTime = Date.now()
    const result: StaticGenerationResult = {
      success: false,
      message: '',
      generatedFiles: [],
      errors: [],
      totalPages: 0,
      totalArticles: 0,
      totalCategories: 0,
      totalTags: 0,
      mainPages: 0,
      performance: {
        totalTime: 0,
        averageTimePerPage: 0,
        concurrentRequests: this.maxConcurrent
      }
    }

    try {
      console.log('🚀 Starting optimized static generation...')
      console.log('📁 Static directory:', this.staticDir)
      console.log(`⚡ Max concurrent requests: ${this.maxConcurrent}`)

      // Clean static directory
      this.cleanStaticDir()

      // Create all directories in advance to reduce I/O operations
      await this.createDirectories()

      // 串行执行，避免同时启动多个任务
      console.log('🏠 Generating home page...')
      await this.generateHomePage(result)

      console.log('📚 Generating archives page...')
      await this.generateArchivesPage(result)

      console.log('ℹ️ Generating about page...')
      await this.generateAboutPage(result)

      console.log('🔗 Generating links page...')
      await this.generateLinksPage(result)

      console.log('📖 Generating daily lib page...')
      await this.generateDailyLibPage(result)

      console.log(' Generating article pages...')
      await this.generateArticlePages(result)

      console.log('📂 Generating category pages...')
      await this.generateCategoryPages(result)

      console.log('🏷️ Generating tag pages...')
      await this.generateTagPages(result)

      console.log('📄 Generating custom pages...')
      await this.generateCustomPages(result)

      result.success = true

      // Count actual files on disk for accurate reporting
      let actualFileCount = 0
      if (existsSync(this.staticDir)) {
        const countFiles = (dir: string) => {
          const files = readdirSync(dir)
          for (const file of files) {
            const filePath = join(dir, file)
            const stat = statSync(filePath)
            if (stat.isDirectory()) {
              countFiles(filePath)
            } else {
              actualFileCount++
            }
          }
        }
        countFiles(this.staticDir)
      }

      const totalTime = Date.now() - startTime
      const totalGenerated =
        result.totalArticles +
        result.totalCategories +
        result.totalTags +
        result.totalPages +
        result.mainPages
      const averageTimePerPage = totalGenerated > 0 ? totalTime / totalGenerated : 0

      result.performance = {
        totalTime,
        averageTimePerPage,
        concurrentRequests: this.maxConcurrent
      }

      // Filter out failed generations from generatedFiles count
      const successfulFiles = result.generatedFiles.length - result.errors.length

      result.message = `Static generation completed successfully. Generated ${successfulFiles} files (${result.errors.length} errors) in ${(totalTime / 1000).toFixed(2)}s.`

      console.log(`📊 Generation Summary:`)
      console.log(`   - Main pages: ${result.mainPages}`)
      console.log(`   - Articles: ${result.totalArticles}`)
      console.log(`   - Categories: ${result.totalCategories}`)
      console.log(`   - Tags: ${result.totalTags}`)
      console.log(`   - Custom pages: ${result.totalPages}`)
      console.log(`   - Total attempted: ${totalGenerated}`)
      console.log(`   - Generated files array: ${result.generatedFiles.length}`)
      console.log(`   - Successful files: ${successfulFiles}`)
      console.log(`   - Actually written to disk: ${actualFileCount} files`)
      console.log(`   - Errors: ${result.errors.length}`)
      console.log(`   - Total time: ${(totalTime / 1000).toFixed(2)}s`)
      console.log(`   - Average time per page: ${averageTimePerPage.toFixed(2)}ms`)
      console.log(`   - Pages per second: ${(totalGenerated / (totalTime / 1000)).toFixed(2)}`)

      // Debug information
      if (result.generatedFiles.length !== totalGenerated) {
        console.log(
          `⚠️  Warning: Generated files count (${result.generatedFiles.length}) does not match calculated total (${totalGenerated})`
        )
        console.log(
          `   - This might be due to duplicate files or failed generations still being counted`
        )
      }

      return result
    } catch (error) {
      const totalTime = Date.now() - startTime
      result.performance = {
        totalTime,
        averageTimePerPage: 0,
        concurrentRequests: this.maxConcurrent
      }
      result.success = false
      result.message = `Static generation failed: ${error}`
      result.errors.push(error as string)
      console.error('❌ Static generation error:', error)
      return result
    }
  }

  /**
   * Create all necessary directories in advance
   */
  private async createDirectories() {
    const dirs = [
      join(this.staticDir, 'archives'),
      join(this.staticDir, 'categories'),
      join(this.staticDir, 'tags'),
      join(this.staticDir, 'pages')
    ]

    for (const dir of dirs) {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
      }
    }
    console.log('📁 Created all directories in advance')
  }

  /**
   * Process items with concurrency control and optimized memory management
   */
  private async processWithConcurrency<T>(
    items: T[],
    processor: (item: T) => Promise<void>,
    batchSize: number = this.maxConcurrent
  ) {
    console.log(` Processing ${items.length} items with batch size ${batchSize}...`)
    this.logMemoryUsage('start')

    const batches: T[][] = []
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize))
    }

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]
      console.log(`🔄 Processing batch ${i + 1}/${batches.length} (${batch.length} items)...`)

      await Promise.all(batch.map((item) => processor(item)))

      // 每5个批次后记录内存使用
      if ((i + 1) % 5 === 0) {
        this.logMemoryUsage(`batch ${i + 1}`)
      }
    }

    this.logMemoryUsage('end')
  }

  /**
   * Generate home page
   */
  private async generateHomePage(result: StaticGenerationResult) {
    try {
      console.log('🏠 Generating home page...')
      const html = await this.fetchPage('/')
      const filePath = join(this.staticDir, 'index.html')
      this.writeFile(filePath, html)
      result.generatedFiles.push('index.html')
      result.mainPages++

      this.logMemoryUsage('home page completed')
      console.log('✅ Generated home page')
    } catch (error) {
      result.errors.push(`Home page generation failed: ${error}`)
      console.error('❌ Home page generation failed:', error)
    }
  }

  /**
   * Generate archives page
   */
  private async generateArchivesPage(result: StaticGenerationResult) {
    try {
      console.log('📚 Generating archives page...')
      const html = await this.fetchPage('/archives')
      const filePath = join(this.staticDir, 'archives', 'index.html')
      this.writeFile(filePath, html)
      result.generatedFiles.push('archives/index.html')
      result.mainPages++

      this.logMemoryUsage('archives page completed')
      console.log('✅ Generated archives page')
    } catch (error) {
      result.errors.push(`Archives page generation failed: ${error}`)
      console.error('❌ Archives page generation failed:', error)
    }
  }

  /**
   * Generate about page
   */
  private async generateAboutPage(result: StaticGenerationResult) {
    try {
      console.log('ℹ️ Generating about page...')
      const html = await this.fetchPage('/about')
      const filePath = join(this.staticDir, 'about', 'index.html')
      this.writeFile(filePath, html)
      result.generatedFiles.push('about/index.html')
      result.mainPages++

      this.logMemoryUsage('about page completed')
      console.log('✅ Generated about page')
    } catch (error) {
      result.errors.push(`About page generation failed: ${error}`)
      console.error('❌ About page generation failed:', error)
    }
  }

  /**
   * Generate links page
   */
  private async generateLinksPage(result: StaticGenerationResult) {
    try {
      console.log('🔗 Generating links page...')
      const html = await this.fetchPage('/links')
      const filePath = join(this.staticDir, 'links', 'index.html')
      this.writeFile(filePath, html)
      result.generatedFiles.push('links/index.html')
      result.mainPages++

      this.logMemoryUsage('links page completed')
      console.log('✅ Generated links page')
    } catch (error) {
      result.errors.push(`Links page generation failed: ${error}`)
      console.error('❌ Links page generation failed:', error)
    }
  }

  /**
   * Generate daily lib page
   */
  private async generateDailyLibPage(result: StaticGenerationResult) {
    try {
      console.log('📖 Generating daily lib page...')
      const html = await this.fetchPage('/daily-lib')
      const filePath = join(this.staticDir, 'daily-lib', 'index.html')
      this.writeFile(filePath, html)
      result.generatedFiles.push('daily-lib/index.html')
      result.mainPages++

      this.logMemoryUsage('daily lib page completed')
      console.log('✅ Generated daily lib page')
    } catch (error) {
      result.errors.push(`Daily lib page generation failed: ${error}`)
      console.error('❌ Daily lib page generation failed:', error)
    }
  }

  /**
   * Generate all article pages with concurrency
   */
  private async generateArticlePages(result: StaticGenerationResult) {
    try {
      const articles = await articleService.getArticles(
        { status: 10 },
        { page: 1, pageSize: 10000 }
      )
      console.log(`📝 Generating ${articles.dataList.length} article pages with concurrency...`)

      await this.processWithConcurrency(articles.dataList, async (article) => {
        try {
          const html = await this.fetchPage(`/archives/${article.url}`)
          const filePath = join(this.staticDir, 'archives', `${article.url}`, 'index.html')
          this.writeFile(filePath, html)
          result.generatedFiles.push(`archives/${article.url}/index.html`)
          result.totalArticles++
        } catch (error) {
          result.errors.push(`Article page generation failed for ${article.url}: ${error}`)
          console.error(`❌ Article generation failed for ${article.url}:`, error)
        }
      })

      this.logMemoryUsage('articles completed')

      console.log(`✅ Generated ${result.totalArticles} article pages`)
    } catch (error) {
      result.errors.push(`Article pages generation failed: ${error}`)
      console.error('❌ Article pages generation failed:', error)
    }
  }

  /**
   * Generate all category pages with concurrency
   */
  private async generateCategoryPages(result: StaticGenerationResult) {
    try {
      const categories = await categoryService.getCategories({}, { page: 1, pageSize: 10000 })
      console.log(`📂 Generating ${categories.dataList.length} category pages with concurrency...`)

      // Track unique categories to avoid duplicates
      const uniqueCategories = new Map<string, any>()
      const duplicateCategories: string[] = []
      const failedCategories: string[] = []
      const successfulCategories: string[] = []

      // Filter out duplicate categories by title
      for (const category of categories.dataList) {
        const key = category.alias || category.title
        if (uniqueCategories.has(key)) {
          duplicateCategories.push(key)
          console.log(`⚠️  Duplicate category found: ${key} (ID: ${category.id})`)
        } else {
          uniqueCategories.set(key, category)
        }
      }

      if (duplicateCategories.length > 0) {
        console.log(
          `⚠️  Found ${duplicateCategories.length} duplicate categories: ${duplicateCategories.join(', ')}`
        )
      }

      const uniqueCategoryList = Array.from(uniqueCategories.values())
      console.log(
        `📝 Processing ${uniqueCategoryList.length} unique categories (${categories.dataList.length - uniqueCategoryList.length} duplicates filtered)`
      )

      await this.processWithConcurrency(uniqueCategoryList, async (category) => {
        try {
          const categoryKey = category.alias || category.title
          const categoryUrl = encodeURIComponent(categoryKey)
          const html = await this.fetchPage(`/categories/${categoryUrl}`)

          const filePath = join(this.staticDir, 'categories', `${categoryKey}`, 'index.html')
          this.writeFile(filePath, html)
          result.generatedFiles.push(`categories/${categoryKey}/index.html`)
          result.totalCategories++
          successfulCategories.push(category.title)
          console.log(
            `✅ Generated category: ${category.title} (ID: ${category.id}, alias: ${category.alias})`
          )
        } catch (error) {
          failedCategories.push(category.title)
          result.errors.push(`Category page generation failed for ${category.title}: ${error}`)
          console.error(`❌ Category generation failed for ${category.title}:`, error)
        }
      })

      this.logMemoryUsage('categories completed')

      console.log(`✅ Generated ${result.totalCategories} unique category pages`)
      console.log(`📊 Category Generation Summary:`)
      console.log(`   - Original categories from DB: ${categories.dataList.length}`)
      console.log(`   - Duplicate categories filtered: ${duplicateCategories.length}`)
      console.log(`   - Unique categories processed: ${uniqueCategoryList.length}`)
      console.log(`   - Successfully generated: ${result.totalCategories}`)
      console.log(`   - Failed generations: ${failedCategories.length}`)
      console.log(`   - Successful categories: ${successfulCategories.join(', ')}`)
      console.log(`   - Failed categories: ${failedCategories.join(', ')}`)

      if (result.totalCategories !== uniqueCategoryList.length) {
        console.log(
          `⚠️  Warning: Expected ${uniqueCategoryList.length} categories, but only generated ${result.totalCategories}`
        )
        console.log(`   - Difference: ${uniqueCategoryList.length - result.totalCategories}`)
      }
    } catch (error) {
      result.errors.push(`Category pages generation failed: ${error}`)
      console.error('❌ Category pages generation failed:', error)
    }
  }

  /**
   * Generate all tag pages with concurrency
   */
  private async generateTagPages(result: StaticGenerationResult) {
    try {
      const tags = await tagService.getTags({ page: 1, pageSize: 10000 }, {})
      console.log(`🏷️ Generating ${tags.dataList.length} tag pages with concurrency...`)

      // Track unique tags to avoid duplicates
      const uniqueTags = new Map<string, any>()
      const duplicateTags: string[] = []
      const failedTags: string[] = []
      const successfulTags: string[] = []

      // Filter out duplicate tags by title
      for (const tag of tags.dataList) {
        if (uniqueTags.has(tag.title)) {
          duplicateTags.push(tag.title)
          console.log(`⚠️  Duplicate tag found: ${tag.title} (ID: ${tag.id})`)
        } else {
          uniqueTags.set(tag.title, tag)
        }
      }

      if (duplicateTags.length > 0) {
        console.log(`⚠️  Found ${duplicateTags.length} duplicate tags: ${duplicateTags.join(', ')}`)
      }

      const uniqueTagList = Array.from(uniqueTags.values())
      console.log(
        `📝 Processing ${uniqueTagList.length} unique tags (${tags.dataList.length - uniqueTagList.length} duplicates filtered)`
      )

      await this.processWithConcurrency(uniqueTagList, async (tag) => {
        try {
          const tagUrl = encodeURIComponent(tag.title)
          const html = await this.fetchPage(`/tags/${tagUrl}`)

          const filePath = join(this.staticDir, 'tags', `${tag.title}`, 'index.html')
          this.writeFile(filePath, html)
          result.generatedFiles.push(`tags/${tag.title}/index.html`)
          result.totalTags++
          successfulTags.push(tag.title)
          console.log(`✅ Generated tag: ${tag.title} (ID: ${tag.id})`)
        } catch (error) {
          failedTags.push(tag.title)
          result.errors.push(`Tag page generation failed for ${tag.title}: ${error}`)
          console.error(`❌ Tag generation failed for ${tag.title}:`, error)
        }
      })

      this.logMemoryUsage('tags completed')

      console.log(`✅ Generated ${result.totalTags} unique tag pages`)
      console.log(`📊 Tag Generation Summary:`)
      console.log(`   - Original tags from DB: ${tags.dataList.length}`)
      console.log(`   - Duplicate tags filtered: ${duplicateTags.length}`)
      console.log(`   - Unique tags processed: ${uniqueTagList.length}`)
      console.log(`   - Successfully generated: ${result.totalTags}`)
      console.log(`   - Failed generations: ${failedTags.length}`)
      console.log(`   - Successful tags: ${successfulTags.join(', ')}`)
      console.log(`   - Failed tags: ${failedTags.join(', ')}`)

      if (result.totalTags !== uniqueTagList.length) {
        console.log(
          `⚠️  Warning: Expected ${uniqueTagList.length} tags, but only generated ${result.totalTags}`
        )
        console.log(`   - Difference: ${uniqueTagList.length - result.totalTags}`)
      }
    } catch (error) {
      result.errors.push(`Tag pages generation failed: ${error}`)
      console.error('❌ Tag pages generation failed:', error)
    }
  }

  /**
   * Generate custom pages with concurrency
   */
  private async generateCustomPages(result: StaticGenerationResult) {
    try {
      const pages = await pageService.getPages({ page: 1, pageSize: 10000 }, {})
      console.log(`📄 Generating ${pages.dataList.length} custom pages with concurrency...`)

      await this.processWithConcurrency(pages.dataList, async (page: any) => {
        try {
          const html = await this.fetchPage(`/pages/${page.url}`)
          const filePath = join(this.staticDir, 'pages', `${page.url}`, 'index.html')
          this.writeFile(filePath, html)
          result.generatedFiles.push(`pages/${page.url}/index.html`)
          result.totalPages++
        } catch (error) {
          result.errors.push(`Custom page generation failed for ${page.url}: ${error}`)
          console.error(`❌ Custom page generation failed for ${page.url}:`, error)
        }
      })

      this.logMemoryUsage('custom pages completed')

      console.log(`✅ Generated ${result.totalPages} custom pages`)
    } catch (error) {
      result.errors.push(`Custom pages generation failed: ${error}`)
      console.error('❌ Custom pages generation failed:', error)
    }
  }

  /**
   * Fetch page HTML from local server with timeout and retry
   */
  private async fetchPage(path: string): Promise<string> {
    const url = `${this.baseUrl}${path}`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout)

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Static-Generator/1.0',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          Connection: 'keep-alive',
          'Cache-Control': 'no-cache'
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.text()
    } catch (error: any) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.requestTimeout}ms`)
      }
      throw error
    }
  }

  /**
   * Write file to static directory with optimized I/O
   */
  private writeFile(filePath: string, content: string) {
    const dir = join(filePath, '..')
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
    writeFileSync(filePath, content, 'utf8')
  }

  /**
   * Ensure static directory exists
   */
  private ensureStaticDir() {
    if (!existsSync(this.staticDir)) {
      mkdirSync(this.staticDir, { recursive: true })
      console.log(`📁 Created static directory: ${this.staticDir}`)
    }
  }

  /**
   * Clean static directory
   */
  private cleanStaticDir() {
    if (existsSync(this.staticDir)) {
      rmSync(this.staticDir, { recursive: true, force: true })
      console.log(`🗑️ Cleaned static directory: ${this.staticDir}`)
    }
    this.ensureStaticDir()
  }

  /**
   * Log current memory usage
   */
  private logMemoryUsage(context: string) {
    const used = process.memoryUsage()
    console.log(` Memory usage at ${context}:`)
    console.log(`   - Heap used: ${(used.heapUsed / 1024 / 1024).toFixed(2)}MB`)
    console.log(`   - Heap total: ${(used.heapTotal / 1024 / 1024).toFixed(2)}MB`)
    console.log(`   - RSS: ${(used.rss / 1024 / 1024).toFixed(2)}MB`)
  }
}

export const staticGenerationService = new StaticGenerationService()
