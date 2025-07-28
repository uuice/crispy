import { writeFileSync, mkdirSync, existsSync, rmSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { db } from '@src/libs/db'
import { articleService } from './articleService'
import { pageService } from './pageService'
import { categoryService } from './categoryService'
import { tagService } from './tagService'
import { env } from '../config/env'

export interface StaticGenerationResult {
  success: boolean
  message: string
  generatedFiles: string[]
  errors: string[]
  totalPages: number
  totalArticles: number
  totalCategories: number
  totalTags: number
}

export class StaticGenerationService {
  private staticDir = join(process.cwd(), 'temp', 'static')
  private baseUrl = env['STATIC_GENERATION_BASE_URL'] || env['BASE_URL'] || 'http://localhost:4000'

  constructor() {
    this.ensureStaticDir()
  }

  /**
   * Generate all static pages
   */
  async generateAllStaticPages(): Promise<StaticGenerationResult> {
    const result: StaticGenerationResult = {
      success: false,
      message: '',
      generatedFiles: [],
      errors: [],
      totalPages: 0,
      totalArticles: 0,
      totalCategories: 0,
      totalTags: 0
    }

    try {
      console.log('Starting static generation...')
      console.log('Static directory:', this.staticDir)

      // Clean static directory
      this.cleanStaticDir()

      // Generate static pages
      await this.generateHomePage(result)
      await this.generateArchivesPage(result)
      await this.generateAboutPage(result)
      await this.generateLinksPage(result)
      await this.generateDailyLibPage(result)

      // Generate article pages
      await this.generateArticlePages(result)

      // Generate category pages
      await this.generateCategoryPages(result)

      // Generate tag pages
      await this.generateTagPages(result)

      // Generate custom pages
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

      result.message = `Static generation completed successfully. Generated ${actualFileCount} files (${result.errors.length} errors).`

      console.log(`📊 Generation Summary:`)
      console.log(`   - Attempted to generate: ${result.generatedFiles.length} files`)
      console.log(`   - Actually written to disk: ${actualFileCount} files`)
      console.log(`   - Errors: ${result.errors.length}`)
      console.log(`   - Difference: ${result.generatedFiles.length - actualFileCount} files`)

      return result
    } catch (error) {
      result.success = false
      result.message = `Static generation failed: ${error}`
      result.errors.push(error as string)
      console.error('Static generation error:', error)
      return result
    }
  }

  /**
   * Generate home page
   */
  private async generateHomePage(result: StaticGenerationResult) {
    try {
      const html = await this.fetchPage('/')
      const filePath = join(this.staticDir, 'index.html')
      this.writeFile(filePath, html)
      result.generatedFiles.push('index.html')
      result.totalPages++
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
      const html = await this.fetchPage('/archives')
      const filePath = join(this.staticDir, 'archives', 'index.html')
      this.writeFile(filePath, html)
      result.generatedFiles.push('archives/index.html')
      result.totalPages++
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
      const html = await this.fetchPage('/about')
      const filePath = join(this.staticDir, 'about', 'index.html')
      this.writeFile(filePath, html)
      result.generatedFiles.push('about/index.html')
      result.totalPages++
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
      const html = await this.fetchPage('/links')
      const filePath = join(this.staticDir, 'links', 'index.html')
      this.writeFile(filePath, html)
      result.generatedFiles.push('links/index.html')
      result.totalPages++
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
      const html = await this.fetchPage('/daily-lib')
      const filePath = join(this.staticDir, 'daily-lib', 'index.html')
      this.writeFile(filePath, html)
      result.generatedFiles.push('daily-lib/index.html')
      result.totalPages++
      console.log('✅ Generated daily lib page')
    } catch (error) {
      result.errors.push(`Daily lib page generation failed: ${error}`)
      console.error('❌ Daily lib page generation failed:', error)
    }
  }

  /**
   * Generate all article pages
   */
  private async generateArticlePages(result: StaticGenerationResult) {
    try {
      const articles = await articleService.getArticles(
        { status: 10 },
        { page: 1, pageSize: 10000 }
      )
      console.log(`📝 Generating ${articles.dataList.length} article pages...`)

      for (const article of articles.dataList) {
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
      }
      console.log(`✅ Generated ${result.totalArticles} article pages`)
    } catch (error) {
      result.errors.push(`Article pages generation failed: ${error}`)
      console.error('❌ Article pages generation failed:', error)
    }
  }

  /**
   * Generate all category pages
   */
  private async generateCategoryPages(result: StaticGenerationResult) {
    try {
      const categories = await categoryService.getCategories({}, { page: 1, pageSize: 1000 })
      console.log(`📂 Generating ${categories.dataList.length} category pages...`)

      for (const category of categories.dataList) {
        try {
          const html = await this.fetchPage(`/categories/${category.alias || category.title}`)
          const filePath = join(
            this.staticDir,
            'categories',
            `${category.alias || category.title}`,
            'index.html'
          )
          this.writeFile(filePath, html)
          result.generatedFiles.push(`categories/${category.alias || category.title}/index.html`)
          result.totalCategories++
        } catch (error) {
          result.errors.push(`Category page generation failed for ${category.title}: ${error}`)
          console.error(`❌ Category generation failed for ${category.title}:`, error)
        }
      }
      console.log(`✅ Generated ${result.totalCategories} category pages`)
    } catch (error) {
      result.errors.push(`Category pages generation failed: ${error}`)
      console.error('❌ Category pages generation failed:', error)
    }
  }

  /**
   * Generate all tag pages
   */
  private async generateTagPages(result: StaticGenerationResult) {
    try {
      const tags = await tagService.getTags({ page: 1, pageSize: 1000 }, {})
      console.log(`🏷️ Generating ${tags.dataList.length} tag pages...`)

      for (const tag of tags.dataList) {
        try {
          const html = await this.fetchPage(`/tags/${tag.title}`)
          const filePath = join(this.staticDir, 'tags', `${tag.title}`, 'index.html')
          this.writeFile(filePath, html)
          result.generatedFiles.push(`tags/${tag.title}/index.html`)
          result.totalTags++
        } catch (error) {
          result.errors.push(`Tag page generation failed for ${tag.title}: ${error}`)
          console.error(`❌ Tag generation failed for ${tag.title}:`, error)
        }
      }
      console.log(`✅ Generated ${result.totalTags} tag pages`)
    } catch (error) {
      result.errors.push(`Tag pages generation failed: ${error}`)
      console.error('❌ Tag pages generation failed:', error)
    }
  }

  /**
   * Generate custom pages
   */
  private async generateCustomPages(result: StaticGenerationResult) {
    try {
      const pages = await pageService.getPages({ page: 1, pageSize: 1000 }, {})
      console.log(`📄 Generating ${pages.dataList.length} custom pages...`)

      for (const page of pages.dataList) {
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
      }
      console.log(`✅ Generated ${pages.dataList.length} custom pages`)
    } catch (error) {
      result.errors.push(`Custom pages generation failed: ${error}`)
      console.error('❌ Custom pages generation failed:', error)
    }
  }

  /**
   * Fetch page HTML from local server
   */
  private async fetchPage(path: string): Promise<string> {
    const url = `${this.baseUrl}${path}`
    console.log(`🌐 Fetching: ${url}`)

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Static-Generator/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.text()
  }

  /**
   * Write file to static directory
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
}

export const staticGenerationService = new StaticGenerationService()
