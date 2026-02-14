#!/usr/bin/env bun

import { existsSync, mkdirSync, readdirSync, statSync, copyFileSync, rmSync } from 'fs'
import { join, relative } from 'path'

/**
 * 将服务端资源从源目录复制到构建后的 server 目录
 * 确保 Swagger 文档和 Template 模板在生产环境中可用
 */

interface AssetConfig {
  name: string
  source: string
  target: string
}

interface CopyResult {
  success: boolean
  count: number
}

console.log('🔄 复制服务端资源到构建目录...')

const projectRoot = process.cwd()
const distRoot = join(projectRoot, 'dist/crispy')
const serverDir = join(distRoot, 'server')

// 定义需要复制的资源
const assetsToCopy: AssetConfig[] = [
  {
    name: 'Swagger 文档',
    source: join(projectRoot, 'src/server/docs/swagger'),
    target: join(serverDir, 'docs/swagger')
  },
  {
    name: 'Template 模板',
    source: join(projectRoot, 'src/server/templates'),
    target: join(serverDir, 'templates')
  }
]

// 确保目录存在
function ensureDir(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
    console.log(`✅ 创建目录: ${relative(projectRoot, dir)}`)
  }
}

// 递归复制目录
function copyDirectory(src: string, dest: string): number {
  if (!existsSync(src)) {
    console.log(`⚠️  源目录不存在: ${relative(projectRoot, src)}`)
    return 0
  }

  ensureDir(dest)

  const items = readdirSync(src)
  let copiedCount = 0

  for (const item of items) {
    const srcPath = join(src, item)
    const destPath = join(dest, item)

    const stat = statSync(srcPath)

    if (stat.isDirectory()) {
      const subCopied = copyDirectory(srcPath, destPath)
      copiedCount += subCopied
    } else {
      try {
        copyFileSync(srcPath, destPath)
        console.log(`✅ 复制: ${relative(projectRoot, destPath)}`)
        copiedCount++
      } catch (error) {
        console.error(`❌ 复制失败: ${srcPath}`, error)
      }
    }
  }

  return copiedCount
}

// 删除目录
function removeDirectory(dir: string): void {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true })
    console.log(`🗑️  删除目录: ${relative(projectRoot, dir)}`)
  }
}

// 复制单个资源
function copyAsset(asset: AssetConfig): CopyResult {
  console.log(`\n📁 处理 ${asset.name}:`)
  console.log(`   源: ${relative(projectRoot, asset.source)}`)
  console.log(`   目标: ${relative(projectRoot, asset.target)}`)

  // 如果目标已存在，先删除
  if (existsSync(asset.target)) {
    removeDirectory(asset.target)
  }

  // 复制文件
  const copiedCount = copyDirectory(asset.source, asset.target)

  if (copiedCount > 0) {
    console.log(`   📊 成功复制 ${copiedCount} 个文件`)
    return { success: true, count: copiedCount }
  } else {
    console.log(`   ⚠️  没有文件需要复制`)
    return { success: true, count: 0 }
  }
}

// 显示目录树
function showDirectoryTree(dir: string, prefix = '', maxDepth = 3, currentDepth = 0): void {
  if (currentDepth >= maxDepth || !existsSync(dir)) {
    return
  }

  try {
    const items = readdirSync(dir).sort()

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const itemPath = join(dir, item)
      const isLast = i === items.length - 1
      const currentPrefix = isLast ? '└── ' : '├── '
      const nextPrefix = isLast ? '    ' : '│   '

      console.log(`${prefix}${currentPrefix}${item}`)

      const stat = statSync(itemPath)
      if (stat.isDirectory()) {
        showDirectoryTree(itemPath, prefix + nextPrefix, maxDepth, currentDepth + 1)
      }
    }
  } catch (error) {
    console.log(`${prefix}└── [无法读取目录]`)
  }
}

// 主函数
function main(): void {
  try {
    console.log(`项目根目录: ${projectRoot}`)
    console.log(`构建输出目录: ${distRoot}`)

    // 检查构建输出目录
    if (!existsSync(distRoot)) {
      console.error(`\n❌ 构建输出目录不存在: ${distRoot}`)
      console.error('请先运行 ng build 构建项目')
      process.exit(1)
    }

    if (!existsSync(serverDir)) {
      console.error(`\n❌ Server 目录不存在: ${serverDir}`)
      process.exit(1)
    }

    let totalCopied = 0
    const results: Array<{ asset: string } & CopyResult> = []

    // 复制每个资源
    for (const asset of assetsToCopy) {
      const result = copyAsset(asset)
      results.push({ asset: asset.name, ...result })
      totalCopied += result.count
    }

    // 总结报告
    console.log(`\n📋 复制总结:`)
    for (const result of results) {
      const status = result.success ? '✅' : '❌'
      console.log(`${status} ${result.asset}: 复制了 ${result.count} 个文件`)
    }

    console.log(`\n🎉 服务端资源复制完成！总共复制了 ${totalCopied} 个文件。`)

    // 显示最终的 server 目录结构
    console.log(`\n📁 最终的 server 目录结构:`)
    showDirectoryTree(serverDir, '', 3)

    process.exit(0)
  } catch (error) {
    console.error('❌ 复制过程中发生错误:', error)
    process.exit(1)
  }
}

// 执行主函数
main()
