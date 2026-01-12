import { NextFunction, Request, Response } from 'express'
import path from 'path'
import fs from 'fs'

// 获取package.json路径
const pkgPath = path.resolve(process.cwd(), 'package.json')
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

// 系统信息（可根据实际情况动态获取）
const systemInfo = [
  { label: '系统版本', value: pkg.version || '' },
  { label: 'Node.js 版本', value: process.version },
  { label: '数据库版本', value: 'MariaDB 11.6.2' }, // 可根据实际情况动态获取
  { label: '运行环境', value: process.env['NODE_ENV'] || 'development' },
  { label: '最后构建时间', value: process.env['BUILD_TIME'] || '' }
]

// 依赖信息
const prodDependencies = Object.entries(pkg.dependencies || {}).map(([name, version]) => ({
  name,
  version
}))
const devDependencies = Object.entries(pkg.devDependencies || {}).map(([name, version]) => ({
  name,
  version
}))

export const getSystemInfo = async (req: Request, res: Response, next: NextFunction) => {
  res.json({
    success: true,
    data: {
      systemInfo,
      prodDependencies,
      devDependencies
    }
  })
}
