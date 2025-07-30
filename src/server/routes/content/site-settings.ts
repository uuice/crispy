import { Request, Response, NextFunction } from 'express'
import { success, error } from '../../utils/response'
import { SiteSettingsService } from '../../services/siteSettingsService'

// Get site settings
export const getSiteSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const settings = await SiteSettingsService.getSiteSettings()

    if (!settings) {
      error(res, 'Site settings not found', 404)
      return
    }

    success(res, settings)
  } catch (err: unknown) {
    console.error('Error getting site settings:', err)
    error(res, 'Internal server error')
  }
}
