#!/usr/bin/env bun

import { execSync } from 'child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

interface BuildOptions {
  watch?: boolean
  minify?: boolean
  sourceMap?: boolean
}

class TemplatesBuilder {
  private readonly templatesDir = 'src/server/templates'
  private readonly stylesDir = join(this.templatesDir, 'styles')
  private readonly outputDir = 'public/assets/styles'

  constructor() {
    this.ensureDirectories()
  }

  private ensureDirectories(): void {
    if (!existsSync(this.outputDir)) {
      mkdirSync(this.outputDir, { recursive: true })
    }
  }

  /**
   * Build style.less using two-step process: Less → CSS → Tailwind
   */
  private async buildStyle(options: BuildOptions = {}): Promise<void> {
    try {
      console.log('Building style.less with two-step process...')

      const inputFile = join(this.stylesDir, 'style.less')
      const tempCssFile = join(this.outputDir, 'style-temp.css')
      const outputFile = join(this.outputDir, 'style.css')

      if (!existsSync(inputFile)) {
        console.log('style.less not found, skipping...')
        return
      }

      // Step 1: Compile Less to CSS
      console.log('Step 1: Compiling Less to CSS...')
      const lessCmd = [
        'npx',
        'lessc',
        inputFile,
        tempCssFile,
        ...(options.minify ? ['--compress'] : []),
        ...(options.sourceMap !== false ? ['--source-map'] : [])
      ]

      execSync(lessCmd.join(' '), { stdio: 'inherit' })

      // Step 2: Fix @apply directives by removing commas
      console.log('Step 2: Fixing @apply directives...')
      let cssContent = readFileSync(tempCssFile, 'utf8')

      // Fix @apply directives by removing commas
      cssContent = cssContent.replace(/@apply\s+([^;]+);/g, (match, classes) => {
        // Remove commas and extra spaces
        const cleanClasses = classes.replace(/,/g, ' ').replace(/\s+/g, ' ').trim()
        return `@apply ${cleanClasses};`
      })

      // Write the fixed CSS back
      writeFileSync(tempCssFile, cssContent)

      // Step 3: Process with Tailwind CSS
      console.log('Step 3: Processing with Tailwind CSS...')
      const tailwindCmd = [
        'npx',
        'tailwindcss',
        '-i',
        tempCssFile,
        '-o',
        outputFile,
        '--config',
        'tailwind.templates.config.js',
        '--content',
        tempCssFile,
        ...(options.minify ? ['--minify'] : [])
      ]

      if (options.watch) {
        console.log('Starting Tailwind watcher for style.less...')
        execSync(tailwindCmd.join(' '), { stdio: 'inherit' })
      } else {
        execSync(tailwindCmd.join(' '), { stdio: 'inherit' })

        // Clean up temp file
        if (existsSync(tempCssFile)) {
          execSync(`rm -f "${tempCssFile}"`)
        }

        // Clean up temp map file if it exists
        const tempMapFile = `${tempCssFile}.map`
        if (existsSync(tempMapFile)) {
          execSync(`rm -f "${tempMapFile}"`)
        }

        console.log('✅ style.less built successfully')
      }
    } catch (error) {
      console.error('❌ Failed to build style.less:', error)
      throw error
    }
  }

  async build(options: BuildOptions = {}): Promise<void> {
    console.log('🚀 Starting templates build process...')

    try {
      await this.buildStyle(options)
      console.log('✅ Templates build completed successfully!')
    } catch (error) {
      console.error('❌ Templates build failed:', error)
      process.exit(1)
    }
  }

  async watch(): Promise<void> {
    console.log('👀 Starting templates watch mode...')
    await this.buildStyle({ watch: true })
  }

  async buildProduction(): Promise<void> {
    console.log('🏭 Building templates for production...')
    await this.build({ minify: true, sourceMap: false })
  }

  clean(): void {
    console.log('🧹 Cleaning build artifacts...')

    try {
      const files = [
        join(this.outputDir, 'style.css'),
        join(this.outputDir, 'style.css.map'),
        join(this.outputDir, 'style-temp.css'),
        join(this.outputDir, 'style-temp.css.map')
      ]

      files.forEach((file) => {
        if (existsSync(file)) {
          execSync(`rm -f "${file}"`)
          console.log(`Removed: ${file}`)
        }
      })

      console.log('✅ Clean completed')
    } catch (error) {
      console.error('❌ Clean failed:', error)
    }
  }
}

// CLI interface
async function main(): Promise<void> {
  const builder = new TemplatesBuilder()
  const command = process.argv[2]

  switch (command) {
    case 'build':
      await builder.build()
      break
    case 'watch':
      await builder.watch()
      break
    case 'build:prod':
      await builder.buildProduction()
      break
    case 'clean':
      builder.clean()
      break
    default:
      console.log('Usage: bun run scripts/build-templates.ts <command>')
      console.log('Commands:')
      console.log('  build      - Build templates once')
      console.log('  watch      - Watch mode for development')
      console.log('  build:prod - Build for production (minified)')
      console.log('  clean      - Clean build artifacts')
      process.exit(1)
  }
}

// Run if called directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  main().catch(console.error)
}
