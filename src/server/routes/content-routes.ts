import { Request, RequestHandler, Router } from 'express'
import { adController } from '../controller/ads'
import { adItemController } from '../controller/ad-items'
import { apiLogController } from '../controller/api-logs'
import { articleController } from '../controller/articles'
import { categoryController } from '../controller/categories'
import { attrController } from '../controller/attrs'
import { configController } from '../controller/configs'
import { jobController } from '../controller/jobs'
import { linkController } from '../controller/links'
import { menuController } from '../controller/menus'
import { pageController } from '../controller/pages'
import { tagController } from '../controller/tags'
import { AccessTokenService } from '../services/accessToken.Service'
import { accessTokenController } from '../controller/access-token'
import { error } from '../utils/response'
import { systemInfoController } from '../controller/system'
import { searchController } from '../controller/search'
import { siteSettingsController } from '../controller/site-settings'
import { openaiController } from '../controller/openai'
import { env } from '@src/server/config/env'

// Define token info interface
interface TokenInfo {
  app_name: string
  channel: string
}

// Extend Request type with token info
interface RequestWithToken extends Request {
  tokenInfo?: TokenInfo
}

const router = Router()

// Initialize service
const accessTokenService = new AccessTokenService()

// Create authentication middleware
const authMiddleware: RequestHandler = async (req: Request, res, next) => {
  if (env.isDevelopment()) {
    console.log(req.path)
  }
  if (req.path === '/login' || req.path === '/login/') {
    next()
    return
  }

  // Get token from header
  const token = req.headers['x-access-token'] as string
  if (!token) {
    error(res, 'Access token is required', 401)
    return
  }

  try {
    // Get app_name and channel from headers
    const app_name = req.headers['x-app-name'] as string
    const channel = req.headers['x-channel'] as string
    if (env.isDevelopment()) {
      console.log(app_name, channel)
    }
    if (!app_name || !channel) {
      error(res, 'App name and channel are required', 400)
      return
    }

    // Validate token
    const isValid = await accessTokenService.checkToken({
      app_name,
      channel,
      token
    })

    if (!isValid) {
      error(res, 'Invalid access token', 401)
      return
    }

    // Add token info to request for later use
    ;(req as RequestWithToken).tokenInfo = {
      app_name: app_name as string,
      channel: channel as string
    }
    next()
  } catch (err) {
    console.error('Error validating access token:', err)
    error(res, 'Internal server error', 500)
  }
}

// Apply authentication middleware
router.use(authMiddleware)

// Ad routes
router.get('/ads', adController.getAds)
router.get('/ads/:id', adController.getAd)

// Ad item routes
router.get('/ad-items', adItemController.getAdItems)
router.get('/ad-items/:id', adItemController.getAdItem)

// API log routes
router.get('/api-logs', apiLogController.getApiLogs)
router.get('/api-logs/:id', apiLogController.getApiLog)

// Article routes
router.get('/articles', articleController.getArticles)
router.get('/articles/:id', articleController.getArticle)
router.get('/articles/url/:url', articleController.getArticleByUrl)

// Category routes
router.get('/categories', categoryController.getCategories)
router.get('/categories/tree', categoryController.getCategoryTree)
router.get('/categories/with-count', categoryController.getCategoriesWithArticleCount)
router.get('/categories/:id', categoryController.getCategory)
router.get('/categories/alias/:alias', categoryController.getCategoryByAlias)

// Attrs routes
router.get('/attrs', attrController.getAttrs)
router.get('/attrs/:id', attrController.getAttr)

// Configs routes
router.get('/configs', configController.getConfigs)
router.get('/configs/alias/:alias', configController.getConfigByAlias)
router.get('/configs/site-settings', siteSettingsController.getSiteSettings)
router.get('/configs/:id', configController.getConfig)

// Job routes
router.get('/jobs', jobController.getJobs)
router.get('/jobs/:id', jobController.getJob)

// Link routes
router.get('/links', linkController.getLinks)
router.get('/links/:id', linkController.getLink)

// Menu routes
router.get('/menus', menuController.getMenus)
router.get('/menus/tree', menuController.getMenuTree)
router.get('/menus/:id', menuController.getMenu)

// Tag routes
router.get('/tags', tagController.getTags)
router.get('/tags/:id', tagController.getTag)
router.get('/tags/value/:value', tagController.getTagByValue)

// Page routes
router.get('/pages', pageController.getPages)
router.get('/pages/:id', pageController.getPage)
router.get('/pages/url/:url', pageController.getPageByUrl)

// Register access token routes
router.get('/access-token', accessTokenController.getAccessTokens)
router.get('/access-token/:id', accessTokenController.getAccessTokenById)
router.post('/access-token/check', accessTokenController.checkAccessToken)

router.get('/system/getSystemInfo', systemInfoController.getSystemInfo)

// Search routes
router.get('/search/articles', searchController.searchArticles)
router.get('/search/pages', searchController.searchPages)

// OpenAI AI service routes
router.get('/ai/test', openaiController.testConnection)
router.post('/ai/summary', openaiController.generateSummary)
router.post('/ai/tags', openaiController.generateTags)
router.post('/ai/seo-description', openaiController.generateSEODescription)
router.post('/ai/translate', openaiController.translateText)
router.post('/ai/explain-code', openaiController.explainCode)
router.post('/ai/titles', openaiController.generateTitles)
router.post('/ai/chat', openaiController.chat)

export default router
