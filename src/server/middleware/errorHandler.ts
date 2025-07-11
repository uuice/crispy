import { Request, Response, NextFunction } from 'express'

// 自定义错误类
export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

// 404 错误处理中间件
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`页面不存在: ${req.originalUrl}`, 404)
  next(error)
}

// 全局错误处理中间件
export const globalErrorHandler = (
  error: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500
  let message = '服务器内部错误'
  let isOperational = false

  if (error instanceof AppError) {
    statusCode = error.statusCode
    message = error.message
    isOperational = error.isOperational
  }

  // 记录错误日志
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  })

  // 开发环境显示详细错误信息
  if (process.env['NODE_ENV'] === 'development') {
    res.status(statusCode).json({
      error: {
        message: error.message,
        stack: error.stack,
        statusCode
      }
    })
    return
  }

  // 生产环境处理
  if (isOperational) {
    // 可预期的错误，显示友好的错误页面
    res.status(statusCode).render('error.njk', {
      statusCode,
      message,
      title: getErrorTitle(statusCode)
    })
    return
  }

  // 不可预期的错误，显示通用错误页面
  res.status(500).render('error.njk', {
    statusCode: 500,
    message: '服务器内部错误，请稍后重试',
    title: '服务器错误'
  })
}

// 获取错误标题
function getErrorTitle(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return '请求错误'
    case 401:
      return '未授权'
    case 403:
      return '禁止访问'
    case 404:
      return '页面不存在'
    case 500:
      return '服务器错误'
    default:
      return '错误'
  }
}

// 异步错误捕获包装器
export const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }
}

// 数据库错误处理
export const handleDatabaseError = (error: any): AppError => {
  if (error.code === 'ER_NO_SUCH_TABLE') {
    return new AppError('数据表不存在', 500)
  }

  if (error.code === 'ER_DUP_ENTRY') {
    return new AppError('数据已存在', 400)
  }

  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return new AppError('关联数据不存在', 400)
  }

  return new AppError('数据库操作失败', 500)
}

// 验证错误处理
export const handleValidationError = (error: any): AppError => {
  const errors = Object.values(error.errors).map((err: any) => err.message)
  const message = `数据验证失败: ${errors.join(', ')}`
  return new AppError(message, 400)
}
