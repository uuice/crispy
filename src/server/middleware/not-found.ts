import { NextFunction, Request, Response } from 'express'

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  // Check if the request is for an API endpoint
  if (req.path.startsWith('/api/')) {
    res.status(404).json({
      error: 'Not Found',
      message: 'The requested API endpoint does not exist'
    })
    return
  }

  // For non-API requests, return simple HTML
  res.status(404).send(`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - 页面未找到</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #f8fafc;
      color: #334155;
    }
    .container { 
      text-align: center; 
      max-width: 600px; 
      padding: 2rem;
    }
    h1 { 
      font-size: 3rem; 
      font-weight: 800; 
      color: #0ea5e9; 
      margin-bottom: 1rem;
    }
    p { 
      font-size: 1.25rem; 
      margin-bottom: 2rem; 
      line-height: 1.6;
    }
    a { 
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background: #0ea5e9;
      color: white;
      text-decoration: none;
      border-radius: 0.5rem;
      font-weight: 500;
      transition: background 0.2s;
    }
    a:hover { 
      background: #0284c7; 
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>404 - 页面未找到</h1>
    <p>您访问的页面不存在或已被移动。<br>您可以尝试返回到首页。</p>
    <a href="/">返回首页</a>
    <div style="margin-top: 2rem; font-size: 0.875rem; color: #94a3b8;">
      <p>Crispy - 基于 Express 构建</p>
      <p>错误时间: ${new Date().toLocaleString('zh-CN')}</p>
    </div>
  </div>
</body>
</html>
  `)
}
