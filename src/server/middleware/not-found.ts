import { Request, Response, NextFunction } from 'express'

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  // Check if the request is for an API endpoint
  if (req.path.startsWith('/api/')) {
    res.status(404).json({
      error: 'Not Found',
      message: 'The requested API endpoint does not exist'
    })
    return
  }

  // For non-API requests, render the 404 template with Nunjucks
  res.status(404).render('404.njk', {
    timestamp: new Date(),
    path: req.path,
    userAgent: req.get('User-Agent')
  })
}
