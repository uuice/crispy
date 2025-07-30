import { Request, Response as ExpressResponse, NextFunction } from 'express'
import { AngularNodeAppEngine, writeResponseToNodeResponse } from '@angular/ssr/node'
import { SiteSettingsService } from '../services/siteSettingsService'

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
        // Get site settings for meta tag injection
        const siteSettings = await SiteSettingsService.getSiteSettings()
        const metaTagsHtml = SiteSettingsService.generateMetaTagsHtml(siteSettings)

        // Inject meta tags into the response using writeResponseToNodeResponse
        let html = await response.text()
        html = html.replace('<!-- Dynamic meta tags will be injected here by SSR -->', metaTagsHtml)

        // Create a new Response with the modified HTML
        const modifiedResponse = new Response(html, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        })

        // Use writeResponseToNodeResponse for proper streaming
        await writeResponseToNodeResponse(modifiedResponse, res)
      } else {
        next()
      }
    } catch (error) {
      next(error)
    }
  }
}
