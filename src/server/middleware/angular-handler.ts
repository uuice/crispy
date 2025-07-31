import { Request, Response as ExpressResponse, NextFunction } from 'express'
import { AngularNodeAppEngine, writeResponseToNodeResponse } from '@angular/ssr/node'

// Create Angular SSR handler middleware
export const createAngularHandler = (angularApp: AngularNodeAppEngine) => {
  return async (req: Request, res: ExpressResponse, next: NextFunction) => {
    try {
      // Skip Angular handling for API routes, uploads, and admin/content docs
      if (
        req.path.startsWith('/api/') ||
        req.path.startsWith('/uploads/') ||
        req.path.startsWith('/admin/') ||
        req.path.startsWith('/content/')
      ) {
        return next()
      }

      const response = await angularApp.handle(req)
      if (response) {
        // Use writeResponseToNodeResponse for proper streaming
        await writeResponseToNodeResponse(response, res)
      } else {
        next()
      }
    } catch (error) {
      next(error)
    }
  }
}
