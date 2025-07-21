#!/usr/bin/env bun

import { existsSync, readdirSync, statSync, readFileSync } from 'fs'
import { join, relative } from 'path'

/**
 * 验证服务端资源是否正确移动到 server 目录
 */

interface FileInfo {
  name: string
  path: string
  relativePath: string
  size: number
  mtime: Date
}

interface AssetConfig {
  name: string
  source: string
  target: string
  extensions?: string[]
}

interface VerifyResult {
  success: boolean
  stats?: {
    matchCount: number
    missingCount: number
    differentCount: number
    extraCount: number
  }
  reason: string
}

console.log('🔍 验证服务端资源移动状态...')

const projectRoot = process.cwd()
const distRoot = join(projectRoot, 'dist/crispy')
const serverDir = join(distRoot, 'server')

// 定义要检查的资源
const assetsToCheck: AssetConfig[] = [
  {
    name: 'Swagger 文档',
    source: join(projectRoot, 'src/server/docs/swagger'),
    target: join(serverDir, 'docs/swagger'),
    extensions: ['.ts']
  },
  {
    name: 'Nunjucks 模板',
    source: join(projectRoot, 'src/server/templates'),
    target: join(serverDir, 'templates'),
    extensions: ['.njk', '.md']
  }
]

// 获取目录中的文件
function getFilesRecursive(dir: string, extensions?: string[]): FileInfo[] {
  if (!existsSync(dir)) {
    return []
  }

  const files: FileInfo[] = []
  const items = readdirSync(dir)

  for (const item of items) {
    const itemPath = join(dir, item)
    const stat = statSync(itemPath)

    if (stat.isDirectory()) {
      const subFiles = getFilesRecursive(itemPath, extensions)
      files.push(...subFiles)
    } else if (stat.isFile()) {
      if (!extensions || extensions.some((ext) => item.endsWith(ext))) {
        files.push({
          name: item,
          path: itemPath,
          relativePath: relative(dir, itemPath),
          size: stat.size,
          mtime: stat.mtime
        })
      }
    }
  }

  return files
}

// 比较文件内容
function compareFiles(file1Path: string, file2Path: string): boolean {
  try {
    const content1 = readFileSync(file1Path)
    const content2 = readFileSync(file2Path)
    return content1.equals(content2)
  } catch (error) {
    return false
  }
}

// 验证单个资源类型
function verifyAsset(asset: AssetConfig): VerifyResult {
  console.log(`\n📁 检查 ${asset.name}:`)
  console.log(`   源目录: ${relative(projectRoot, asset.source)}`)
  console.log(`   目标目录: ${relative(projectRoot, asset.target)}`)

  // 检查源目录
  if (!existsSync(asset.source)) {
    console.log(`   ❌ 源目录不存在`)
    return { success: false, reason: '源目录不存在' }
  }

  // 检查目标目录
  if (!existsSync(asset.target)) {
    console.log(`   ❌ 目标目录不存在`)
    return { success: false, reason: '目标目录不存在' }
  }

  // 获取文件列表
  const sourceFiles = getFilesRecursive(asset.source, asset.extensions)
  const targetFiles = getFilesRecursive(asset.target, asset.extensions)

  console.log(`   📊 文件统计: 源 ${sourceFiles.length} → 目标 ${targetFiles.length}`)

  // 检查文件数量
  if (sourceFiles.length === 0) {
    console.log(`   ⚠️  源目录中没有找到相关文件`)
    return { success: true, reason: '源目录为空' }
  }

  if (targetFiles.length === 0) {
    console.log(`   ❌ 目标目录中没有找到相关文件`)
    return { success: false, reason: '目标目录为空' }
  }

  // 详细文件比较
  let matchCount = 0
  let missingCount = 0
  let differentCount = 0

  for (const sourceFile of sourceFiles) {
    const targetFile = targetFiles.find((f) => f.relativePath === sourceFile.relativePath)

    if (!targetFile) {
      console.log(`   ❌ 缺失: ${sourceFile.relativePath}`)
      missingCount++
      continue
    }

    if (compareFiles(sourceFile.path, targetFile.path)) {
      console.log(`   ✅ 匹配: ${sourceFile.relativePath}`)
      matchCount++
    } else {
      console.log(`   ⚠️  不同: ${sourceFile.relativePath}`)
      differentCount++
    }
  }

  // 检查额外文件
  const extraFiles = targetFiles.filter(
    (tf) => !sourceFiles.find((sf) => sf.relativePath === tf.relativePath)
  )

  if (extraFiles.length > 0) {
    console.log(`   📎 额外文件: ${extraFiles.length}`)
    extraFiles.forEach((file) => {
      console.log(`      • ${file.relativePath}`)
    })
  }

  console.log(
    `   📈 结果: ✅${matchCount} ❌${missingCount} ⚠️${differentCount} 📎${extraFiles.length}`
  )

  const success = missingCount === 0 && differentCount === 0
  return {
    success,
    stats: { matchCount, missingCount, differentCount, extraCount: extraFiles.length },
    reason: success ? '验证通过' : '存在缺失或不匹配的文件'
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

// 主验证函数
function main(): void {
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
    console.error('请先运行构建和移动脚本')
    process.exit(1)
  }

  let allSuccess = true
  const results: Array<{ asset: string } & VerifyResult> = []

  // 验证每个资源类型
  for (const asset of assetsToCheck) {
    const result = verifyAsset(asset)
    results.push({ asset: asset.name, ...result })

    if (!result.success) {
      allSuccess = false
    }
  }

  // 总结报告
  console.log(`\n📋 验证总结:`)
  for (const result of results) {
    const status = result.success ? '✅' : '❌'
    console.log(`${status} ${result.asset}: ${result.reason}`)

    if (result.stats) {
      const { matchCount, missingCount, differentCount, extraCount } = result.stats
      console.log(
        `   统计: 匹配${matchCount} 缺失${missingCount} 不同${differentCount} 额外${extraCount}`
      )
    }
  }

  if (allSuccess) {
    console.log(`\n🎉 所有服务端资源验证通过！文件已正确移动到 server 目录。`)

    // 显示构建后的目录结构
    console.log(`\n📁 server 目录结构:`)
    showDirectoryTree(serverDir, '', 3)

    process.exit(0)
  } else {
    console.log(`\n⚠️  部分资源验证失败！`)
    console.log(`建议解决方案:`)
    console.log(`1. 重新运行移动脚本: bun scripts/move-server-assets.ts`)
    console.log(`2. 检查 angular.json 中的 assets 配置`)
    console.log(`3. 重新构建: ng build`)
    process.exit(1)
  }
}

// 执行主函数
main()
