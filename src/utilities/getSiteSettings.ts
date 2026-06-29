import { getCachedGlobal } from './getGlobals'

export const getCachedSiteSettings = () => getCachedGlobal('site-settings', 1)

export const DEFAULT_SITE_NAME = 'Crispy'

export async function getSiteName(): Promise<string> {
  const settings = await getCachedSiteSettings()()
  return settings.siteName || DEFAULT_SITE_NAME
}
