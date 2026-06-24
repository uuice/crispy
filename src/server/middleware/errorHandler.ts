import { NextFunction, Request, Response } from 'express'

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode = 500
  ) {
    super(message)
  }
}

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`页面不存在: ${req.originalUrl}`, 404))
}

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500
  const message = err instanceof AppError ? err.message : '服务器内部错误'

  console.error(`${req.method} ${req.originalUrl}`, err)

  if (req.path.startsWith('/api/') || process.env['NODE_ENV'] === 'development') {
    res.status(statusCode).json({
      message,
      ...(process.env['NODE_ENV'] === 'development' && { stack: err.stack, statusCode })
    })
    return
  }

  res.status(statusCode).type('html').send(`<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8"><title>${statusCode}</title></head>
<body style="font-family:system-ui;text-align:center;padding:4rem">
<h1>${statusCode}</h1><p>${message}</p><a href="/">返回首页</a>
</body></html>`)
}

export const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }
