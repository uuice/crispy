import { Request, Response, NextFunction } from 'express'
import { notFoundTemplate } from '../templates/404'

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  // Check if the request is for an API endpoint
  if (req.path.startsWith('/api/')) {
    res.status(404).json({
      error: 'Not Found',
      message: 'The requested API endpoint does not exist'
    })
    return
  }

  // For non-API requests, send the HTML template
  res.status(404).send(notFoundTemplate)
}
