import { NextFunction, Request, Response as ExpressResponse } from 'express'
import { AngularNodeAppEngine, writeResponseToNodeResponse } from '@angular/ssr/node'

export const createAngularHandler = (angularApp: AngularNodeAppEngine) => {
  return async (req: Request, res: ExpressResponse, next: NextFunction) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
      return next()
    }

    try {
      const response = await angularApp.handle(req)
      if (response) {
        await writeResponseToNodeResponse(response, res)
      } else {
        next()
      }
    } catch (error) {
      next(error)
    }
  }
}
