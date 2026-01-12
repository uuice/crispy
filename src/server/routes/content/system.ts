import { success } from '@src/server/utils/response'
import type { NextFunction, Request, Response } from 'express'
import { readFileSync } from 'fs'
import { join } from 'path'

export const getSystemInfo = async (req: Request, res: Response, next: NextFunction) => {
  // 读取 package.json
  const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'))
  // 系统信息
  const systemInfo = [
    { label: '系统版本', value: pkg.version || '' },
    { label: 'Node.js 版本', value: process.version },
    { label: '数据库版本', value: 'MariaDB 11.6.2' }, // 可根据实际情况动态获取
    { label: '运行环境', value: process.env['NODE_ENV'] || 'development' },
    { label: '最后构建时间', value: process.env['BUILD_TIME'] || '' }
  ]
  // 依赖
  const prodDependencies = Object.entries(pkg.dependencies || {}).map(([name, version]) => ({
    name,
    version
  }))
  const devDependencies = Object.entries(pkg.devDependencies || {}).map(([name, version]) => ({
    name,
    version
  }))
  success(res, {
    systemInfo,
    prodDependencies,
    devDependencies
  })
}

export const systemRouterController = {
  getSystemInfo
}
