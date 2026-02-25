#!/usr/bin/env bun

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

async function generateSwaggerDocs() {
  try {
    console.log('🚀 开始生成Swagger文档...')

    //直导入现有的swagger配置
    const { adminSpecs, contentSpecs } = await import('../src/server/config/swagger.ts')

    const projectRoot = process.cwd()
    const docRoot = join(projectRoot, 'public', 'doc')

    // 创建目录结构
    const adminDir = join(docRoot, 'admin')
    const contentDir = join(docRoot, 'content')

    if (!existsSync(adminDir)) {
      mkdirSync(adminDir, { recursive: true })
    }
    if (!existsSync(contentDir)) {
      mkdirSync(contentDir, { recursive: true })
    }

    // 生成Admin Swagger文档
    const adminSwaggerPath = join(adminDir, 'swagger.json')
    writeFileSync(adminSwaggerPath, JSON.stringify(adminSpecs, null, 2))
    console.log(`✅ Admin Swagger文档已生成: ${adminSwaggerPath}`)

    // 生成Content Swagger文档
    const contentSwaggerPath = join(contentDir, 'swagger.json')
    writeFileSync(contentSwaggerPath, JSON.stringify(contentSpecs, null, 2))
    console.log(`✅ Content Swagger文档已生成: ${contentSwaggerPath}`)

    console.log('\n🎉 Swagger文档生成完成！')
    console.log(`📄 文档位置:`)
    console.log(`   - Admin: ${adminSwaggerPath}`)
    console.log(`   - Content: ${contentSwaggerPath}`)
  } catch (error) {
    console.error('❌ 生成Swagger文档时出错:', error)
    process.exit(1)
  }
}

//执行生成
generateSwaggerDocs()
