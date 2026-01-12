import { NextFunction, Request, Response } from 'express'
import { error, success } from '../../utils/response'
import { staticGenerationService } from '../../services/staticGenerationService'
import fs from 'fs'
import path from 'path'

// Generate all static pages
export const generateStaticPages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('Starting static generation from API...')

    const result = await staticGenerationService.generateAllStaticPages()

    if (result.success) {
      success(res, {
        message: result.message,
        generatedFiles: result.generatedFiles,
        mainPages: result.mainPages,
        totalPages: result.totalPages,
        totalArticles: result.totalArticles,
        totalCategories: result.totalCategories,
        totalTags: result.totalTags,
        errors: result.errors,
        performance: result.performance
      })
    } else {
      error(res, result.message, 500)
    }
  } catch (err: unknown) {
    console.error('Static generation API error:', err)
    error(res, 'Static generation failed')
  }
}

// Get static generation status
export const getStaticGenerationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const staticDir = path.join(process.cwd(), 'temp', 'static')

    let fileCount = 0
    let totalSize = 0

    if (fs.existsSync(staticDir)) {
      const countFiles = (dir: string) => {
        const files = fs.readdirSync(dir)
        for (const file of files) {
          const filePath = path.join(dir, file)
          const stat = fs.statSync(filePath)
          if (stat.isDirectory()) {
            countFiles(filePath)
          } else {
            fileCount++
            totalSize += stat.size
          }
        }
      }

      countFiles(staticDir)
    }

    success(res, {
      staticDirExists: fs.existsSync(staticDir),
      fileCount,
      totalSize: `${(totalSize / 1024 / 1024).toFixed(2)} MB`,
      lastGenerated: fs.existsSync(staticDir) ? fs.statSync(staticDir).mtime : null,
      staticDir: staticDir,
      note: 'fileCount shows actual files on disk, generation count may include failed attempts'
    })
  } catch (err: unknown) {
    console.error('Static generation status error:', err)
    error(res, 'Failed to get static generation status')
  }
}

// Clear static cache
export const clearStaticCache = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const staticDir = path.join(process.cwd(), 'temp', 'static')

    if (fs.existsSync(staticDir)) {
      fs.rmSync(staticDir, { recursive: true, force: true })
      console.log('🗑️ Cleared static cache directory:', staticDir)
    }

    success(res, {
      message: 'Static cache cleared successfully',
      staticDirExists: false,
      fileCount: 0,
      totalSize: '0 MB',
      lastGenerated: null,
      staticDir: staticDir
    })
  } catch (err: unknown) {
    console.error('Clear static cache error:', err)
    error(res, 'Failed to clear static cache')
  }
}

export const staticGenerationController = {
  generateStaticPages,
  getStaticGenerationStatus,
  clearStaticCache
}
