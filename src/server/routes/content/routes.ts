import { RequestHandler, Router, Request } from 'express'
import { userController } from './users'
import { adController } from './ads'
import { additionController } from './additions'
import { adItemController } from './ad-items'
import { apiLogController } from './api-logs'
import { articleController } from './articles'
import { categoryController } from './categories'
import { attrController } from './attrs'
import { cacheController } from './caches'
import { configController } from './configs'
import { enumController } from './enums'
import { holidayController } from './holidays'
import { jobController } from './jobs'
import { keywordController } from './keywords'
import { linkController } from './links'
import { menuController } from './menus'
import { noticeController } from './notices'
import { operateLogController } from './operate-logs'
import { pageController } from './pages'
import { roleController } from './roles'
import { ruleController } from './rules'
import { tagController } from './tags'
import { userTypeController } from './user-types'
import { voteController } from './votes'
import { voteItemController } from './vote-items'
import { AccessTokenService } from '../../services/accessToken.Service'
import { accessTokenController } from './access-token'
import { error } from '../../utils/response'
import { systemRouterController } from './system'
import { flexsearchService } from '../../services/flexsearch-index.service'
import { searchController } from './search'
import { getSiteSettings } from './site-settings'
import { openaiController } from './openai'

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
  console.log(req.path)
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
    console.log(app_name, channel)
    if (!app_name || !channel) {
      error(res, 'App name and channel are required', 400)
      return
    }

    // Validate token
    const isValid = await accessTokenService.checkToken(
      app_name as string,
      channel as string,
      token
    )

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

// User routes
router.get('/users', userController.getUsers)
router.get('/users/:id', userController.getUser)

// Ad routes
router.get('/ads', adController.getAds)
router.get('/ads/:id', adController.getAd)

// Ad item routes
router.get('/ad-items', adItemController.getAdItems)
router.get('/ad-items/:id', adItemController.getAdItem)

// Addition routes
router.get('/additions', additionController.getAdditions)
router.get('/additions/:id', additionController.getAddition)

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

// Caches routes
router.get('/caches', cacheController.getCaches)
router.get('/caches/:id', cacheController.getCache)

// Configs routes
router.get('/configs', configController.getConfigs)
router.get('/configs/alias/:alias', configController.getConfigByAlias)
router.get('/configs/site-settings', getSiteSettings)
router.get('/configs/:id', configController.getConfig)

// Enums routes
router.get('/enums', enumController.getEnums)
router.get('/enums/:id', enumController.getEnum)

// Holidays routes
router.get('/holidays', holidayController.getHolidays)
router.get('/holidays/:id', holidayController.getHoliday)

// Job routes
router.get('/jobs', jobController.getJobs)
router.get('/jobs/:id', jobController.getJob)

// Keyword routes
router.get('/keywords', keywordController.getKeywords)
router.get('/keywords/:id', keywordController.getKeyword)

// Link routes
router.get('/links', linkController.getLinks)
router.get('/links/:id', linkController.getLink)

// Menu routes
router.get('/menus', menuController.getMenus)
router.get('/menus/tree', menuController.getMenuTree)
router.get('/menus/:id', menuController.getMenu)

// Notice routes
router.get('/notices', noticeController.getNotices)
router.get('/notices/:id', noticeController.getNotice)

// Operate log routes
router.get('/operate-logs', operateLogController.getOperateLogs)
router.get('/operate-logs/:id', operateLogController.getOperateLog)

// Role routes
router.get('/roles', roleController.getRoles)
router.get('/roles/:id', roleController.getRole)

// Rule routes
router.get('/rules', ruleController.getRules)
router.get('/rules/tree', ruleController.getRuleTree)
router.get('/rules/:id', ruleController.getRule)

// Tag routes
router.get('/tags', tagController.getTags)
router.get('/tags/:id', tagController.getTag)
router.get('/tags/value/:value', tagController.getTagByValue)

// Page routes
router.get('/pages', pageController.getPages)
router.get('/pages/:id', pageController.getPage)
router.get('/pages/url/:url', pageController.getPageByUrl)

// User type routes
router.get('/user-types', userTypeController.getUserTypes)
router.get('/user-types/:id', userTypeController.getUserType)

// Vote routes
router.get('/votes', voteController.getVotes)
router.get('/votes/:id', voteController.getVote)

// Vote item routes
router.get('/vote-items', voteItemController.getVoteItems)
router.get('/vote-items/:id', voteItemController.getVoteItem)

// Register access token routes
router.get('/access-token', accessTokenController.getAccessTokens)
router.get('/access-token/:id', accessTokenController.getAccessToken)
router.post('/access-token/check', accessTokenController.checkAccessToken)

router.get('/system/getSystemInfo', systemRouterController.getSystemInfo)

// 全文检索接口
router.get('/search/articles', searchController.searchArticles)
router.get('/search/pages', searchController.searchPages)
router.get('/search/daily', searchController.searchDaily)

// OpenAI AI 服务接口
router.get('/ai/test', openaiController.testConnection)
router.post('/ai/summary', openaiController.generateSummary)
router.post('/ai/tags', openaiController.generateTags)
router.post('/ai/seo-description', openaiController.generateSEODescription)
router.post('/ai/translate', openaiController.translateText)
router.post('/ai/explain-code', openaiController.explainCode)
router.post('/ai/titles', openaiController.generateTitles)
router.post('/ai/chat', openaiController.chat)

export default router
