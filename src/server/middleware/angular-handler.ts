import { Request, Response, NextFunction } from 'express'
import { AngularNodeAppEngine, writeResponseToNodeResponse } from '@angular/ssr/node'

// Create Angular SSR handler middleware
export const createAngularHandler = (angularApp: AngularNodeAppEngine) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await angularApp.handle(req)
      if (response) {
        writeResponseToNodeResponse(response, res)
      } else {
        next()
      }
    } catch (error) {
      next(error)
    }
  }
}
